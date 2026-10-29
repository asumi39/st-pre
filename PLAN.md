# SillyTavern 社团分享 · 执行方案

> 以 SillyTavern 为钩子，让完全不懂 LLM 的同学在"玩"里看懂 LLM 原理。
> 幻灯片本身是第一件展品——质量优先，所有动效都在讲知识点。

---

## 执行纪律

1. **按图施工**：本方案是既定规格。技术选型、页面结构与顺序、内容大纲、目录约定均按文档执行；自由度仅限文档未规定的实现细节。
2. **不降级，升级留痕**：禁止降级——更省事的实现、次一等的选型、砍功能、跳过既定环节都算。实现层面发现明确更优的做法（同等满足铁律：离线可放映、动效即知识点、Key 零暴露）可以做，但须在交付说明中留痕；页面结构、内容文案、既定接口约定的变更不属于"升级"，仍按第 4 条上交裁定。
3. **遇阻让路**：某一步走不通（依赖缺失、环境受限、外部服务异常）时，不原地卡死、不擅自换方案——记录阻塞点与已试路径，转做下一个可执行的部分。
4. **残项上交**：可执行部分全部完成后，把残留阻塞项汇总为「现象 / 已尝试 / 影响范围 / 待决选项」提交用户裁定；裁定前保持原样，不得自行定案。
5. **审查门不动**：标注"用户审 / 用户选定 / 用户确认"的产出（内容稿、视觉方向、幻灯片定稿、部署动作），未经确认不进入下一阶段。

---

## 1. 定案记录

| 项 | 结论 |
|---|---|
| 受众 | AI 社团同学，零 LLM 基础 |
| 主题重心 | ST 本体（是什么/能做什么）为主，LLM 理论只保留最小必要 |
| 优先级 | 先做**带 LIVE 的完整幻灯片**；体验站为最后增量（阶段 5） |
| 时长 | 正片 30 分钟 + 现场体验 15 分钟 + Q&A |
| 讲者备注 | 简洁版：每页 3~5 条要点 + 串场句（换人也能讲） |
| 模型 | **DeepSeek**（`deepseek-flash`，OpenAI 兼容） |
| 视觉协作 | 设计探索由 OpenDesign 承担（`start_run` 出样张、用户在 OD 内迭代、`get_artifact` 拉回 tokens）；验收统一 design-taste-frontend |
| 代码管理 | 本机开发测试 → GitHub 私有仓库 `asumi39/st-pre` |
| 设计铁律 | 教室离线可放映；所有动效都在讲知识点；LIVE 必有模拟兜底；Key 永不进仓库 |

## 2. 幻灯片内容（21 页）

| 幕 | 页 | 内容 |
|---|---|---|
| 开场 | ①② | 封面「今晚，酒馆开张」；Hook：真实 AI 角色对话，抛问"背后发生了什么？" |
| LLM 背景 | ③④ | 文字接龙 + 提示词就是一切；没有记忆 → 上下文窗口 |
| ST 是什么 | ⑤~⑨ | 身世与定位（TavernAI 分叉、开源、Power Users）；前端/后端分离架构；能接什么模型——云 API（DeepSeek / GLM / Qwen / Claude / Gemini / OpenRouter）、本地（KoboldCpp / llama.cpp / Ollama）、免费（AI Horde / Pollinations，均开箱即用）；跨平台 + 数据自主；诚实的定位（适合谁/不适合谁，提 RisuAI 等替代）。最新版 **v1.19.0（2026.09）**，AGPL-3.0，仍在活跃更新 |
| 能做什么 | ⑩~⑮ | 角色卡（PNG 里藏结构化设定，V2/V3 卡规范互通）；群聊；世界书（关键词触发）；扩展生态（TTS/绘图/翻译/总结/正则）；界面可玩性；玩法案例（跑团 GM / 语言陪练 / 小说共创，**本机 ST 实录素材**） |
| 解剖一次对话 | ⑯~⑱ | 请求拼装解剖图；世界书触发 = RAG 思想；聊久了会忘 → 总结与向量 |
| 上手 | ⑲~㉑ | 三条上手路径 + API 选择；安全避坑（Key/隐私/内容分寸）；从玩到学 + Q&A + 二维码 |

**页面里的"活演示"**（动效即知识点）：

| 演示 | 实现 | 讲的知识点 |
|---|---|---|
| token 流式逐字 | GSAP SplitText | 逐 token 生成原理 |
| 上下文窗口模拟器 | 自研交互组件（拖滑块） | 消息挤爆窗口、最早记忆被淘汰 |
| 请求拼装动画 | DrawSVG + 时间线编排 | prompt = 角色卡+世界书+预设+聊天记录 |
| 流式对话回放 | 假聊天窗口装载实录记录 | 角色扮演实际效果 |
| 分支热点 | slideshow 特性，⑩⑫与结尾页预埋深挖分支 | Q&A 弹药 |
| **LIVE 开关** | 见 §4 | 前端/后端分离的活证据 |

## 3. 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 放映引擎 | **HyperFrames slideshow** | 确定性 seek 时间线：导航即 seek，活演示永不失同步；内置讲者备注（按 deck 保存）、fragments、分支热点、全屏、触摸、计数器；`npx hyperframes check --json` 结构校验。2b 初设先以两页样张（封面+解剖页）验证引擎手感 |
| 动画编排 | GSAP 3.13+（全插件免费，vendor 进仓库） | SplitText / DrawSVG / 时间线编排 |
| 设计系统 | 2a 定方向 → tokens.css 沉淀（色板/字阶/间距/组件样式） | 纯 CSS，与引擎解耦 |
| 教学模拟器 | 自研（GSAP 驱动） | 无现成库的内容组件 |
| LIVE 接线 | `proxy/` 单文件 Node 服务（本地演示与服务器部署两用，持有 Key） | 幻灯片 JS 永远接触不到 Key |

## 4. LIVE 模式技术设计

> 规格来源：api-docs.deepseek.com（2026-10 版）。

```
幻灯片组件 (fetch, SSE 解析)
   │  POST /live/chat  {messages}     # 预置短剧本，≤4 条消息
   ▼
proxy/ （单文件 Node 服务，无依赖）
   │  读 DEEPSEEK_KEY（环境变量或本地 key 文件，不进仓库）
   ▼
POST https://api.deepseek.com/chat/completions   Authorization: Bearer <KEY>
     { "model": "deepseek-flash",            # 现行模型名（V4.1-Flash-1017 服务）
       "messages": [...],
       "thinking": { "type": "disabled" },   # 必须显式关闭：默认 enabled，
                                             # 会先输出 reasoning_content 且首包延迟大增
       "max_tokens": 120,
       "temperature": 0.9,                   # 默认即 1；非思考模式下 top_p 固定无效，不传
       "stream": true,
       "stream_options": { "include_usage": true },
       "user_id": "st-pre-live" }            # 缓存/调度隔离标识
   │  SSE：choices[0].delta.content 逐段转发，终止于 data: [DONE]；
   │  usage 统计搭在最后一个内容 chunk 上（无独立 usage chunk）
   ▼
幻灯片逐字渲染（与模拟路径同一套渲染管线）
```

- **双模**：每个活演示组件有 `sim` / `live` 两种数据源，同一渲染管线；全局开关（URL 参数 `?live=1` 或隐藏快捷键）
- **回退触发**：首包 >6s 超时 / 网络错误 / SSE 中断 / 上游错误码——401（Key 错）、402（欠费）、429（限流）、500/503（服务端）→ 无感切回罐头剧本；proxy 返回首 token 前显示生成指示
- **控成本控时长**：预置短 prompt，`max_tokens` 限制 120。Flash 档官方定价（2026-10）：输出空闲 4 元/M、高峰 8 元/M，输入未命中 1~2 元/M——单次 LIVE 调用约 0.002 元；usage 随流返回，proxy 记日志做成本观测
- **验证口径**：真实调用跑通 ≥1 次 + 断网回退测试通过 + 上游 401/429 错误注入各一次 + Key 零暴露

## 5. 目录结构

```
ST-PRE/
├── PLAN.md                  # 本文档
├── .gitignore               # 密钥文件、系统垃圾、临时产物
├── deepseek-key.txt         # [git 忽略] DeepSeek Key
├── imagegen.txt             # [git 忽略] 图片模型中转配置
├── notes/
│   └── content.md           # 21 页内容稿（文案+图示创意+讲者备注）
├── slides/                  # 幻灯片（slideshow 契约）
│   ├── index.html           # <hyperframes-slideshow> 入口
│   ├── deck/                # 场景组合 + slideshow JSON island
│   ├── assets/              # 截图/插画/录屏素材
│   ├── vendor/              # gsap 等（提交进仓库，保证离线可复现）
│   └── tokens.css           # 设计系统
├── proxy/
│   └── server.mjs           # LIVE 代理（单文件，node 直接跑）
├── guide/                   # 伴学指南静态站
├── deploy/
│   ├── nginx.conf.example   # 静态站 + proxy 反代
│   ├── docker-compose.yml   # ST 实例（阶段 5）
│   ├── config.yaml.template # ST multi-user + DeepSeek 预配置
│   └── README.md            # 北京服务器部署手册（HTTPS/建号/安全清单/压测）
└── tools/                   # 一次性脚本（二维码、图片生成、素材裁切）
```

## 6. 交付物与验收口径

| # | 交付物 | 形态 | 验收 |
|---|---|---|---|
| 1 | 内容稿 | `notes/content.md` | 用户审 |
| 2 | 幻灯片（含 LIVE 开关） | `slides/` | `check --json` 干净 + design-taste-frontend 验收 + Chromium/Firefox/WebKit 三引擎 + chrome-devtools trace 60fps |
| 3 | LIVE 代理 | `proxy/server.mjs` | 真实调用跑通 + 断网回退 + Key 零暴露 |
| 4 | PDF 讲义 | `snapshot --at` 逐页合成 | 版式完整 |
| 5 | 伴学指南站 | `guide/`（上手清单/API 指引/角色卡下载/FAQ/二维码） | 走查通过 |
| 6 | 部署套件 | `deploy/` | 本机跑通到"缺服务器"那步 |
| 7 | 上线 | 主域=幻灯片回看+`/guide`+proxy | 手机扫码全链路 |
| 8 | 体验站（阶段 5 增量） | ST 实例：multi-user、批量建号、预置官方角色卡 | 30 人同时能聊 |

## 7. 工具链分工（按 AGENTS.md 路由）

- **设计探索**：OpenDesign（`start_run` 生成样张，run 通常 5~30 分钟，与内容稿并行；定稿后 `get_artifact` 一次拉回入口文件+引用的全部 tokens/资源）
- **构建**：`web-design-engineer`（HTML 幻灯片）+ slideshow 契约；**design-taste-frontend** 统一验收（`inspect.mjs`/`lint.mjs` 兼验指南站）
- **QA**：agent-browser（默认走查+上线验收，Chromium 系）→ firefox MCP（引擎兼容）→ safari-official（WebKit/观众 iPhone）→ chrome-devtools 仅 trace/CDP 性能分析
- **素材**：本机 Docker 起真 ST 抓截图录屏（peekaboo.capture 直出 MP4）；chrome-devtools.screencast 录幻灯片动画兜底；ffmpeg 压缩；`gh` 拉 SillyTavern 官方仓库取自带角色卡（版权干净）
- **图片生成**：`imagegen.txt` 通道（OpenAI 兼容中转）：`POST https://wawapii.com/v1/images/generations`，JSON + Bearer，最小规格 `{"model":"gpt-image-2.5-sunburst","prompt":"…","size":"1024x1024","quality":"low","n":1}`；响应同时含 `b64_json` 与 `url`，**优先取 b64 落盘**（url 为中转 OSS 直链，保存期无承诺）；单张约 35s；图生图走 `/v1/images/edits`（multipart，仅回 url）。**逐张先给 prompt 确认再花钱**
- **研究**：websearch / tavily（ST 最新特性、生态事实核查）
- **提醒/知识**：openchamber_notify（长任务）；openchamber_knowledge（跨会话计划）
- **部署/验收**：rsync+ssh；agent-browser 全链路自动化；二维码 `npx qrcode`
- **辅助技能**：animation-performance、fixing-motion-performance、impeccable/extract

## 8. 图片生成清单（5~8 张，逐张确认）

| # | 图 | 用途 |
|---|---|---|
| 1 | 封面主视觉 | 「酒馆开张」氛围插画，设计语言定调之作 |
| 2 | 章节页视觉 | 五幕共用的分隔背景一套（2~3 张变体） |
| 3 | 玩法案例点缀插画 | 跑团/陪练/共创三场景（配合实录内容） |
| 4 | 自制教学演示卡头像 | 第⑩页拆解"一张卡里有什么"用的结构清晰示例卡 |

来源规则：UI 素材=本机 ST 实拍截图；示意图/解剖图=页内 SVG 动画；二维码=程序生成；体验站角色卡=官方自带卡。

## 9. 阶段计划

| 阶段 | 内容 | 产出 | 依赖 |
|---|---|---|---|
| 0 开工 | `git init`+`.gitignore`、GitHub 私有仓库、装三项技能 | 工程底座 | — |
| 1 内容稿 | 21 页逐页文案+图示创意+备注 | `notes/content.md` | **用户审** |
| 2a 视觉定调 | OpenDesign 出 2~3 个视觉方向样张（各含封面+解剖页，run 与阶段 1 并行）→ 用户在 OD 内评审选定 → `get_artifact` 拉回 → 沉淀 tokens.css | 设计系统 | — |
| 2b 实现 | slideshow spike 验证 → 全量 21 页+活演示（模拟路径）+素材生产（本机 Docker ST 实拍：截图/官方卡/⑮页案例实录） | `slides/` 初版 | 1+2a |
| 2c 打磨 | 讲者备注、fragments 节奏、分支热点、三引擎 QA、trace、**关 Wi-Fi 干跑**、PDF | 幻灯片定稿 | 2b |
| 2d LIVE | proxy 开发+接线+DeepSeek 真实调用验证+回退测试 | 交付物 3 | 2c |
| 3 配套 | 指南站 | 交付物 5 | 与 2d 并行 |
| 4 部署 | 幻灯片+指南+proxy 上北京服务器、HTTPS、nginx | 交付物 7 | 用户确认服务器就绪 |
| 5 体验站 | ST 实例部署、multi-user 建号、压测彩排 | 交付物 8 | 部署完成后随时 |

## 10. 部署架构（阶段 4/5，北京服务器 + 已备案域名）

```
tavern.<域名>            → slides 静态站（观众扫码回看）+ /guide/ 指南
tavern.<域名>/live/      → proxy（反代，持有 Key，限流：简单 IP 计数）
play.<域名>              → SillyTavern 实例（阶段 5；子域名不另需备案）
                          enableUserAccounts + enableDiscreetLogin
                          批量建号 u001~N：users-admin HTTP 端点 + admin 会话脚本循环
                          （handle 规则 = 小写字母/数字/短横线）
                          预置角色卡：content scaffolding（/default/scaffold/index.json，
                          type "character"，启动时自动复制进每个用户目录）
                          DeepSeek API 预配置（OpenAI 兼容自定义端点，model `deepseek-flash`，见 config.yaml.template。
                          ⚠ ST 官方文档的 DeepSeek 条目仍写 `deepseek-chat`/`deepseek-reasoner`，已过时，以 DeepSeek 官方文档为准）
                          ⚠ ST 官方明示：多用户密码"非安全特性"、全部数据明文存储——部署手册
                            安全清单必须写明：仅限社团可信范围、反代限流、定期备份、敏感内容不上
HTTPS：Let's Encrypt / acme.sh；nginx 反代 ST（WebSocket upgrade）
```

## 11. 风险与兜底

| 风险 | 兜底 |
|---|---|
| slideshow 引擎风险 | 2b spike 提前验证；断网干跑提前暴露 |
| 现场断网 | 幻灯片离线放映；LIVE 无感回退模拟；录屏兜底 |
| DeepSeek 延迟/限流 | LIVE 预置短 prompt 限 max_tokens |
| 观众 iPhone 错版 | safari-official 提前验 WebKit |
| 分享日早于阶段 5 | 体验环节改为指南站引导自助安装，不取消 |
| Key 泄漏 | 密钥文件 git 忽略 + 运行时加载 + proxy 端限流 |

## 12. 安全与密钥策略

- `deepseek-key.txt`、`imagegen.txt` 一律 `.gitignore`，永不进仓库
- proxy 运行时从环境变量 `DEEPSEEK_KEY` 或本地文件读取；服务器上写入 systemd env 或 `.env`（同样不入库）
- 图片中转 Key 同理，仅 `tools/` 脚本运行时读取

## 13. 前置条件

- 模型凭据：`deepseek-key.txt`（DeepSeek API Key）
- 图片通道凭据：`imagegen.txt`（WawAPI 中转配置）
- 阶段 4 前：北京服务器就绪（SSH 方式、域名解析到位、备案可用于子域名）
- 阶段 5 前：体验站规模预期（建号数量、是否长期开放）
