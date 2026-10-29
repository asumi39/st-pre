#!/usr/bin/env node
/**
 * ST-PRE LIVE proxy — 单文件零依赖（node: 内置模块，node >= 18）。
 *
 *   node proxy/server.mjs        # 监听 3011（避开 3000~3005，hyperframes 占用）
 *
 * 路由：
 *   GET  /live/health → 200 {"ok":true}
 *   POST /live/chat   → 向 DeepSeek 发起流式请求，以 SSE 事件转发给客户端
 *                        event: delta  data: {"t":"文字"}
 *                        event: done   data: {"usage":{...}}   ← usage 来自最后一个内容 chunk
 *                        event: error  data: {"code":401}      ← 上游 HTTP 状态码（数字）
 *                                      data: {"code":"timeout"} ← 首包 >6s（已中止上游）
 *                                      data: {"code":"network"} ← 连接失败 / 流中断
 *
 * DeepSeek 调用规格见 PLAN.md §4（api-docs.deepseek.com，2026-10）：
 *   - POST {BASE}/chat/completions，Authorization: Bearer <KEY>
 *   - model deepseek-flash；thinking 显式 disabled（默认 enabled 会先吐 reasoning_content
 *     且首包延迟大增）；max_tokens 120；temperature 0.9；非思考模式 top_p 无效故不传
 *   - stream:true + stream_options.include_usage；usage 统计搭在最后一个内容 chunk 上
 *
 * Key 来源：环境变量 DEEPSEEK_KEY 优先；否则读仓库根 deepseek-key.txt（已 gitignore）。
 *          Key 绝不出现在日志、响应、错误信息中；启动日志只打「key loaded: yes/no」。
 *
 * 测试钩子：DEEPSEEK_BASE_URL 可把上游指向本地 mock（默认 https://api.deepseek.com）。
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- 配置 ----------
const PORT = Number(process.env.PORT || 3011);
const BASE_URL = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
const UPSTREAM_PATH = '/chat/completions';

const MODEL = 'deepseek-flash';
const MAX_TOKENS = 120;
const TEMPERATURE = 0.9;
const USER_ID = 'st-pre-live';

const MAX_MESSAGES = 4; // 预置短剧本上限（客户端保证，服务端兜底校验）
const BODY_LIMIT = 64 * 1024; // 请求体字节上限
const FIRST_PACKET_TIMEOUT_MS = 6000; // 首包超时
const RATE_LIMIT = 10; // 每 IP 每分钟最多 POST /live/chat 次数
const RATE_WINDOW_MS = 60_000;

const UPSTREAM_ROLES = new Set(['system', 'user', 'assistant']);

// ---------- key ----------
function loadKey() {
  const fromEnv = process.env.DEEPSEEK_KEY;
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') return fromEnv.trim();
  try {
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const key = fs.readFileSync(path.join(repoRoot, 'deepseek-key.txt'), 'utf8').trim();
    return key !== '' ? key : null;
  } catch {
    return null;
  }
}
const KEY = loadKey();

// ---------- 工具 ----------
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function sseWrite(res, event, data) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function clientIp(req) {
  // 只信 socket 地址（X-Forwarded-For 可伪造，会让限流形同虚设）；
  // 部署在 nginx 后时全体客户端共享反代 IP，此限制退化为全站 10 次/分，可接受。
  return (req.socket.remoteAddress || 'unknown').replace(/^::ffff:/, '');
}

// 每 IP 固定 60s 窗口计数
const rateBuckets = new Map();
function allowRequest(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start >= RATE_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(ip, bucket);
    if (rateBuckets.size > 1000) {
      for (const [k, v] of rateBuckets) if (now - v.start >= RATE_WINDOW_MS) rateBuckets.delete(k);
    }
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('BODY_TOO_LARGE')));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length < 1) return 'messages 必须是非空数组';
  if (messages.length > MAX_MESSAGES) return `messages 超过 ${MAX_MESSAGES} 条上限`;
  for (const m of messages) {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return '每条 message 必须是对象';
    if (typeof m.role !== 'string' || !UPSTREAM_ROLES.has(m.role)) {
      return 'message.role 必须是 system/user/assistant';
    }
    if (typeof m.content !== 'string') return 'message.content 必须是字符串';
  }
  return null;
}

function plainJson(res, status, obj, extraHeaders) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (extraHeaders) for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
}

// ---------- 上游代理 ----------
async function proxyChat(res, ip, messages) {
  let settled = false;
  let timedOut = false;
  let usage = null;
  const upstream = new AbortController();

  const finish = (outcome, code) => {
    if (settled) return;
    settled = true;
    clearTimeout(firstPacketTimer);
    if (outcome === 'error') {
      sseWrite(res, 'error', { code });
      log(`chat ip=${ip} error=${code}`);
    } else {
      sseWrite(res, 'done', { usage });
      log(`chat ip=${ip} ok in=${usage?.prompt_tokens ?? '?'} out=${usage?.completion_tokens ?? '?'}`);
    }
    res.end();
  };

  // 客户端提前断开：中止上游请求，避免无谓消耗
  res.on('close', () => {
    if (!settled) {
      settled = true;
      clearTimeout(firstPacketTimer);
      upstream.abort();
      log(`chat ip=${ip} client-abort`);
    }
  });

  // 首包超时：中止上游并回报 {"code":"timeout"}
  const firstPacketTimer = setTimeout(() => {
    timedOut = true;
    upstream.abort();
  }, FIRST_PACKET_TIMEOUT_MS);

  let resp;
  try {
    resp = await fetch(`${BASE_URL}${UPSTREAM_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        thinking: { type: 'disabled' },
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        stream: true,
        stream_options: { include_usage: true },
        user_id: USER_ID,
      }),
      signal: upstream.signal,
    });
  } catch {
    finish('error', timedOut ? 'timeout' : 'network');
    return;
  }

  if (!resp.ok) {
    try {
      await resp.body?.cancel();
    } catch {}
    finish('error', resp.status); // 401/402/429/500/503 等原样以数字回报
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let sawDone = false;

  const consumeLine = (line) => {
    if (!line.startsWith('data:')) return;
    const payload = line.slice(5).trim();
    if (payload === '[DONE]') {
      sawDone = true;
      return;
    }
    let obj;
    try {
      obj = JSON.parse(payload);
    } catch {
      return;
    }
    if (obj && typeof obj.usage === 'object' && obj.usage !== null) usage = obj.usage;
    const delta = obj?.choices?.[0]?.delta?.content;
    if (typeof delta === 'string' && delta !== '') sseWrite(res, 'delta', { t: delta });
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(firstPacketTimer); // 收到首包（此行之后重复调用为空操作）
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf('\n')) !== -1) {
        const line = buf.slice(0, nl).replace(/\r$/, '');
        buf = buf.slice(nl + 1);
        consumeLine(line);
        if (sawDone) break;
      }
      if (sawDone) break;
    }
    if (!sawDone && buf.startsWith('data:')) consumeLine(buf.replace(/\r$/, '')); // 无换行残尾
  } catch {
    finish('error', timedOut ? 'timeout' : 'network');
    return;
  }

  try {
    await reader.cancel();
  } catch {}
  finish('done'); // 正常结束（[DONE] 或上游收流）；未拿到 usage 时为 null
}

// ---------- HTTP 入口 ----------
async function handleChat(req, res) {
  const ip = clientIp(req);

  // 限流：普通 HTTP 429（不进 SSE）
  if (!allowRequest(ip)) {
    plainJson(res, 429, { error: 'rate_limited' }, { 'Retry-After': String(Math.ceil(RATE_WINDOW_MS / 1000)) });
    log(`chat ip=${ip} rate-limited`);
    return;
  }

  // 读取请求体：普通 HTTP 错误
  let bodyText;
  try {
    bodyText = await readBody(req, BODY_LIMIT);
  } catch {
    plainJson(res, 413, { error: 'body_too_large' });
    log(`chat ip=${ip} bad-body`);
    return;
  }

  let messages;
  try {
    messages = JSON.parse(bodyText || '{}').messages;
  } catch {
    plainJson(res, 400, { error: 'invalid_json' });
    log(`chat ip=${ip} bad-json`);
    return;
  }

  const problem = validateMessages(messages);
  if (problem) {
    plainJson(res, 400, { error: 'bad_messages', message: problem });
    log(`chat ip=${ip} bad-messages`);
    return;
  }
  messages = messages.map((m) => ({ role: m.role, content: m.content })); // 白名单字段透传

  // 之后一切错误都以 SSE 事件回报
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // nginx 反代不缓冲 SSE
  res.flushHeaders?.();

  if (!KEY) {
    // 本地未配置 Key → 与上游 401 同信号，客户端走同一条回退路径
    sseWrite(res, 'error', { code: 401 });
    res.end();
    log('chat error=401 (no key configured)');
    return;
  }

  await proxyChat(res, ip, messages);
}

const server = http.createServer((req, res) => {
  // CORS：本地开发放开
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (pathname === '/live/health') {
    if (req.method !== 'GET') return plainJson(res, 405, { error: 'method_not_allowed' });
    return plainJson(res, 200, { ok: true });
  }

  if (pathname === '/live/chat') {
    if (req.method !== 'POST') return plainJson(res, 405, { error: 'method_not_allowed' });
    handleChat(req, res).catch(() => {
      // 兜底：任何意外异常都转成 SSE 事件后关闭，不让进程崩
      sseWrite(res, 'error', { code: 'network' });
      res.end();
    });
    return;
  }

  plainJson(res, 404, { error: 'not_found' });
});

server.on('clientError', (_err, socket) => socket.destroy());

server.listen(PORT, () => {
  log(`LIVE proxy listening on :${PORT}, upstream ${BASE_URL}${UPSTREAM_PATH}`);
  log(`key loaded: ${KEY ? 'yes' : 'no'}`);
});
server.on('error', (err) => {
  log(`server error: ${err?.message ?? err}`);
  process.exit(1);
});

// 进程级兜底：记录但不崩溃（请求级错误已在上方全部转为 SSE 事件）
process.on('uncaughtException', (err) => log(`uncaught: ${err?.message ?? err}`));
process.on('unhandledRejection', (err) => log(`unhandled-rejection: ${err?.message ?? err}`));
