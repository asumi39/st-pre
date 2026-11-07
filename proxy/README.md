# ST-PRE LIVE Proxy

单文件、零依赖（仅 `node:` 内置模块）的 DeepSeek 流式代理。持有 Key，幻灯片 JS 永远接触不到它。调用规格见下方「端点契约」（api-docs.deepseek.com，2026-10 版）。

## 怎么跑

```bash
node proxy/server.mjs
# [timestamp] LIVE proxy listening on :3011, upstream https://api.deepseek.com/chat/completions
# [timestamp] key loaded: yes
```

要求 node ≥ 18（仓库环境 22.x）。端口 3011（避开 3000~3005，hyperframes 占用）。

## 环境变量

| 变量 | 必填 | 默认 | 说明 |
|---|---|---|---|
| `DEEPSEEK_KEY` | 否 | — | Key 首选来源。未设置时读仓库根 `deepseek-key.txt`（已 gitignore） |
| `DEEPSEEK_BASE_URL` | 否 | `https://api.deepseek.com` | 上游基址，仅测试用（指向本地 mock / 断网端口） |
| `PORT` | 否 | `3011` | 监听端口 |

**Key 安全**：任何情况下不写入日志、响应、错误信息；启动日志只打 `key loaded: yes/no`。两者都拿不到时服务照常启动，`/live/health` 正常，`/live/chat` 回 SSE `error {"code":401}`（与上游 Key 错同信号）。

## 端点契约

### `GET /live/health`

`200 {"ok":true}` — 存活探针，不泄露任何配置信息。

### `POST /live/chat`

请求体 `{"messages":[...]}`（预置短剧本，≤4 条；服务端兜底校验，超限普通 HTTP 400）：

```json
{"messages":[{"role":"user","content":"用一句话欢迎来到深夜酒馆"}]}
```

响应为 SSE 流（`Content-Type: text/event-stream`），三种事件：

| 事件 | data | 语义 |
|---|---|---|
| `delta` | `{"t":"文字"}` | `choices[0].delta.content` 逐段转发（只发非空段） |
| `done` | `{"usage":{...}}` | 正常结束；usage 来自最后一个内容 chunk（`stream_options.include_usage`），拿不到时为 `null` |
| `error` | `{"code":…}` | 见下表；发出后连接关闭 |

**error.code 语义（客户端据此无感回退罐头剧本）**：

| code | 含义 |
|---|---|
| `401` / `402` / `429` / `500` / `503`（数字） | 上游 HTTP 状态码原样透传（Key 错 / 欠费 / 限流 / 服务端错误） |
| `"timeout"` | 首包 >6s 无响应（已中止上游请求） |
| `"network"` | 连接失败、流中断等网络层错误 |

**普通 HTTP 错误（SSE 开始之前）**：`400` messages 非法/超 4 条；`413` 请求体 >64KB；`429` 限流（每 IP 每分钟 10 次，`Retry-After: 60`）。客户端对非 2xx 直接回退即可。

**上游请求体（服务端固定拼装，客户端只提供 messages）**：

```json
{
  "model": "deepseek-flash",
  "messages": [...],
  "thinking": { "type": "disabled" },
  "max_tokens": 120,
  "temperature": 0.9,
  "stream": true,
  "stream_options": { "include_usage": true },
  "user_id": "st-pre-live"
}
```

> `thinking` 必须显式 disabled——默认 enabled 会先输出 `reasoning_content` 且首包延迟大增；非思考模式 top_p 固定无效，故不传。

**其他**：CORS `*`（处理 OPTIONS 预检）；`X-Accel-Buffering: no`（nginx 反代不缓冲 SSE）；客户端中途断开时代理立即中止上游请求。

### 幻灯片端最小示例

```js
const resp = await fetch('http://127.0.0.1:3011/live/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
  signal: AbortSignal.timeout(15000),
});
if (!resp.ok) return fallback();            // 400/413/429
const reader = resp.body.getReader();
const decoder = new TextDecoder();
let buf = '';
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  let i;
  while ((i = buf.indexOf('\n\n')) !== -1) {
    const frame = buf.slice(0, i); buf = buf.slice(i + 2);
    const event = /event: (.+)/.exec(frame)?.[1];
    const data = JSON.parse(/data: (.+)/.exec(frame)?.[1] ?? '{}');
    if (event === 'delta') render(data.t);
    else if (event === 'done') reportUsage(data.usage);
    else if (event === 'error') return fallback(data.code);
  }
}
```

## 部署

本地演示直接 `node proxy/server.mjs`；服务器部署建议 systemd 常驻 + nginx 反代（`deploy/nginx.conf.example`），反代需关闭 `proxy_buffering`（响应头已带 `X-Accel-Buffering: no`，nginx 默认尊重）。Key 在服务器上以 `DEEPSEEK_KEY` 环境变量或同位置 key 文件提供。

## 验证

7 项验收（真实调用 / 401 / 429 / 断网 / 首包超时 / Key 零暴露 / 限流）的命令与结果见 [TESTING.md](./TESTING.md)。
