#!/usr/bin/env node
/**
 * mock-llm.mjs — 本地零依赖 OpenAI 兼容 mock 流式服务（演示用）
 *
 * 用途：给本机跑起来的 SillyTavern 提供「大脑」，让演示录屏有真实的
 * 流式逐字回复；绝不调用任何真实外部 API，也不读任何真实 Key。
 *
 * 启动：node mock-llm.mjs
 *   环境变量：
 *     MOCK_PORT        默认 9999
 *     MOCK_CHUNK_MS    每个 SSE chunk 间隔毫秒，默认 55
 *     MOCK_CHUNK_CHARS 每个 chunk 字符数，默认 2
 *
 * 端点：
 *   GET  /v1/models                模型列表（供 ST 下拉框）
 *   POST /v1/chat/completions      stream=true 走 SSE；stream=false 返回整段
 *
 * 场景识别：扫描请求 messages 文本里的关键词，
 *   跑团 GM（守望者/掷骰/地下城…）、语言陪练（Coach Emma…）、
 *   小说共创（玄青/接龙/续写…）、Seraphina（官方卡）与通用闲聊。
 */
import http from 'node:http';

const PORT = Number(process.env.MOCK_PORT || 9999);
const CHUNK_MS = Number(process.env.MOCK_CHUNK_MS || 55);
const CHUNK_CHARS = Number(process.env.MOCK_CHUNK_CHARS || 2);

const MODEL = 'st-pre-mock';

/* ---------------- 场景台词（角色扮演质感，预置） ---------------- */

const REPLIES = {
  rpg: () => {
    return `🎲 **侦察检定：d20 = 17 + 3（敏捷）= 20 —— 成功！**

你屏住呼吸，贴着长满苔藓的石墙缓缓挪动。火把的光晕在十步开外摇晃，两名哥布林守卫正背对着你争抢一块发霉的干肉，完全没注意到你的存在。

> **【探索状态】**
> ▸ 位置：废弃哨塔 · 一层大厅
> ▸ HP 24/24 ｜ MP 6/9 ｜ 火把余量 42 分钟
> ▸ 新情报：守卫身后有一道半开的铁门，门缝里渗出幽绿的微光

石厅深处忽然传来锁链拖地的声响——一下，又一下，缓慢却沉重，像有什么庞然大物正在苏醒。

**你要怎么行动？**
① 趁守卫分神，潜行穿过铁门（敏捷检定 d20+5）
② 绕行侧廊，先查清锁链声的来源（感知检定 d20+2）
③ 其他任何你想做的事——告诉我，我们来掷骰。`;
  },

  tutor: (userText) => {
    const m = (userText.match(/[A-Za-z][A-Za-z ,.'?!-]{15,}/) || [])[0];
    const said = (m || 'your sentence').trim();
    return `Good try! I understood you completely — nice use of past tense. 👍 Now let's polish two verbs.

You said: "${said}"

**Small fix:**
• "have went" → **went** — "go" is irregular: go → went → gone. With "yesterday", simple past is the most natural choice, so we don't need "have".
• "buyed" → **bought** — another irregular verb: buy → bought. English kept these from Old English, no "-ed" needed.

**更自然的说法：** "I went to the store yesterday and bought some apples."

📌 Memory trick: irregular verbs often travel in threes — sing/sang/sung, drink/drank/drunk. Say "went & bought" out loud twice; rhythm helps memory.

Your turn: try one sentence with **went** or **bought** — I'll check it!`;
  },

  novel: () => {
    return `**卷一 · 剑问青冥（续）**

寒光未至，剑鸣先响。沈青崖足尖在云阶上一点，身形向后飘出三丈——那道寒光擦着他方才立足之处掠过，将一株合抱粗的古松拦腰斩断，切口平滑如镜。

"剑冢的看门人，也会偷袭？"他稳住身形，掌心那枚剑丸忽然发烫，隔着皮肉传来一阵急促的搏动，像一颗雀跃的心脏。

雾气自谷底翻涌而上。雾中走出一个披蓑戴笠的老者，肩上扛着一柄没有鞘的长剑，剑身斑驳，却隐有龙吟之声。

"小娃娃，"老者咧嘴一笑，露出缺了一角的门牙，"踏进剑冢的人，要么留下一柄剑，要么——把自己变成一柄剑。"

沈青崖缓缓按住剑丸，垂眸一笑："那要看，前辈的剑，配不配让我的剑出鞘。"

---
*【本章剩 3 处可由你接龙：老者的来历 / 剑丸的异动 / 云阶下的第二道寒光】*`;
  },

  seraphina: (userText) => {
    if (/守护者|森林|熟悉|林子/.test(userText)) {
      return `*塞拉菲娜的眼神飘向窗外沉沉的夜色，翅膀微微收拢。*

"守护者……算是吧。" *她轻笑了一声，指尖拂过窗台上那盆会发光的苔藓。* "这片林子里的每一棵树都记得我的名字，就像我记得每一只受过伤的小狐狸。"

*她转回头，琥珀色的眼睛里闪过一丝不易察觉的忧伤。*

"不过，旅人，那晚袭击你们商队的狼群不太对劲。它们眼睛里泛着紫光——那不是野兽该有的颜色。" *她压低了声音。* "最近林子深处似乎有什么东西在苏醒，连古树都在做噩梦。"

*她为你掖了掖毛毯，语气重新变得温柔。*

"所以你留下来是对的~ 至少在我弄清楚那是什么之前，别再独自进林子了，好吗？答应我。🌙"`;
    }
    return `*塞拉菲娜把一枚发光的羽毛轻轻别在耳后，金色的眸子弯成了月牙。*

"欢迎回来，旅人~" *她为你的杯子续上热气腾腾的蜜果茶，翅膀上的光辉在酒馆的烛光里明明灭灭。* "看你风尘仆仆的样子，是刚从灰烬荒原回来吧？北边的商队昨天还在说，那里夜里能听见远古巨龙的呼吸声呢。"

*她凑近了些，压低声音，尾羽好奇地翘起。*

"怎么样，这次冒险有什么有意思的见闻吗？还是说……你又在宝箱里捡到了什么奇怪的诅咒物品？上次那顶'会抱怨的帽子'可把我们大家都逗笑了。"

*炉火噼啪作响，酒馆里飘着烤苹果和肉桂的香气。*

"慢慢说吧，今晚的时间还长着呢。✨"`;
  },

  generic: () => {
    return `*灯光柔和地闪了一下，酒馆的常客向你举了举杯。*

"晚上好呀~" *老板娘擦着杯子走过来，笑意盈盈。* "今天想聊点什么？冒险故事、奇闻异事，还是单纯想找人说说今天的心情？"

*炉火烧得正旺，窗外的夜色安稳。这里很安全，你可以慢慢说。*`;
  },
};

/* ---------------- 场景识别 ---------------- */

function detectScene(messages) {
  const text = messages.map((m) => `${m.role}:${m.content ?? ''}`).join('\n').slice(0, 20000);
  if (/(守望者|地下城|跑团|掷骰|roll\s?d?\d|d20|检定|GM\s*模式)/i.test(text)) return 'rpg';
  if (/(Coach\s*Emma|语言陪练|纠错|grammar|练英语|口语)/i.test(text)) return 'tutor';
  if (/(玄青|剑冢|接龙|续写|共创|小说)/i.test(text)) return 'novel';
  if (/Seraphina/i.test(text)) return 'seraphina';
  return 'generic';
}

function lastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      const c = messages[i].content;
      if (typeof c === 'string') return c;
      if (Array.isArray(c)) return c.map((p) => p.text || '').join(' ');
    }
  }
  return '';
}

/* ---------------- SSE 输出 ---------------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function chunkFrame(id, delta, finish = null) {
  return (
    `data: ${JSON.stringify({
      id,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: MODEL,
      choices: [{ index: 0, delta, finish_reason: finish }],
    })}\n\n`
  );
}

async function writeStream(res, text) {
  const id = `chatcmpl-${Date.now().toString(36)}`;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no',
  });
  res.write(chunkFrame(id, { role: 'assistant', content: '' }));
  const chars = [...text];
  for (let i = 0; i < chars.length; i += CHUNK_CHARS) {
    if (res.writableEnded) return;
    res.write(chunkFrame(id, { content: chars.slice(i, i + CHUNK_CHARS).join('') }));
    await sleep(CHUNK_MS + Math.floor(Math.random() * 25));
  }
  res.write(chunkFrame(id, {}, 'stop'));
  res.write('data: [DONE]\n\n');
  res.end();
}

function writeWhole(res, text) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({
    id: `chatcmpl-${Date.now().toString(36)}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: MODEL,
    choices: [{ index: 0, message: { role: 'assistant', content: text }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 128, completion_tokens: [...text].length, total_tokens: 128 + [...text].length },
  }));
}

/* ---------------- HTTP 服务 ---------------- */

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
    return res.end();
  }

  if (req.method === 'GET' && (url === '/v1/models' || url === '/models')) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({
      object: 'list',
      data: [
        { id: MODEL, object: 'model', created: 1700000000, owned_by: 'st-pre-mock' },
        { id: 'st-pre-mox', object: 'model', created: 1700000000, owned_by: 'st-pre-mock' },
      ],
    }));
  }

  if (req.method === 'POST' && (url === '/v1/chat/completions' || url === '/chat/completions')) {
    let body = '';
    req.on('data', (d) => { body += d; if (body.length > 5e6) req.destroy(); });
    req.on('end', async () => {
      let messages = [];
      let stream = true;
      try {
        const parsed = JSON.parse(body || '{}');
        messages = Array.isArray(parsed.messages) ? parsed.messages : [];
        stream = parsed.stream !== false;
      } catch { /* 宽容处理 */ }
      const scene = detectScene(messages);
      const text = (REPLIES[scene] || REPLIES.generic)(lastUserText(messages));
      console.log(`[mock] scene=${scene} stream=${stream} chars=${[...text].length}`);
      if (stream) await writeStream(res, text);
      else writeWhole(res, text);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: { message: `no route: ${req.method} ${url}` } }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[mock] OpenAI-compatible mock LLM listening on http://0.0.0.0:${PORT}/v1`);
  console.log(`[mock] chunk=${CHUNK_CHARS} chars / ~${CHUNK_MS}ms — 场景：跑团GM / 语言陪练 / 小说共创 / Seraphina`);
});
