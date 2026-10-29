# ST-PRE 素材清单（assets-manifest）

本机实拍的 SillyTavern 素材，全部落盘离线可用（无任何远程热链）。
生成日期：2026-10-30。所有截图/录屏均来自本机 Docker 里跑起来的真实 ST 实例。

## 环境信息

- **ST 版本号：1.19.0**（容器内 `package.json` 实测）
- **镜像**：`ghcr.io/sillytavern/sillytavern:latest`
  digest `sha256:b712eb8609f2d9b9f820b581fecfc7cd400c50a6c6533287cbbd368c4fb1d060`
- 运行方式：`docker run -d --name st-pre -p 8000:8000 -v st_pre_data:/home/node/app/data`
- 「大脑」：本目录 `tools/mock-llm.mjs`（零依赖 Node 单文件，OpenAI 兼容 SSE 流式 mock，
  端口 9999，按消息关键词识别 跑团GM / 语言陪练 / 小说共创 / Seraphina 场景）。
  **不调用任何真实外部 API、不读任何真实 Key。**

## UI 截图（第⑭页）—— `ui/`

| 文件 | 内容 | 来源 | 分辨率 | 用页 |
|---|---|---|---|---|
| ui-desktop.png | 桌面主界面：官方卡 Seraphina 对话（深色主题，中文界面，2 轮角色对话） | 本机 ST 1.19.0 实拍（agent-browser，1920×1080 视口） | 1920×1080 | ⑭ |
| ui-mobile.png | 同一 Seraphina 聊天的移动竖屏形态（像聊天 App） | 同上（390×844 视口） | 390×844 | ⑭ |
| ui-skin.png | 「游戏 UI 化」自定义 CSS 效果：跑团 GM 聊天（卡片消息 + 金色等宽角色名 + 绿色状态栏 blockquote，含 🎲 骰子检定） | 同上 + ST「用户设置 → 自定义 CSS」注入（CSS 已在录制后移除） | 1920×1080 | ⑭ |
| ui-wizard-spare.png | 首次启动欢迎向导（备用素材，可选） | 同上 | 1920×1080 | 备用 |

游戏皮肤 CSS 原文（已从 ST 移除，供复现）：

```css
/* ST-PRE game skin — demo custom CSS */
#chat { --game-accent:#7ee787; --game-gold:#e3b341; }
#chat .mes { border:1px solid rgba(126,231,135,.16); border-radius:14px;
  background:linear-gradient(180deg, rgba(30,38,52,.85), rgba(14,18,26,.92));
  box-shadow:0 6px 18px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.05);
  margin:12px 0; padding:6px 8px; }
#chat .mes .name_text { font-family:ui-monospace,"SF Mono",monospace;
  letter-spacing:.1em; color:var(--game-gold); }
#chat .mes_text { font-family:ui-monospace,"SF Mono",Menlo,monospace; font-size:15px; }
#chat .mes_text blockquote { border-left:3px solid var(--game-accent);
  background:rgba(126,231,135,.08); border-radius:6px; padding:8px 12px; color:#b8f0c2; }
```

## 玩法实录（第⑮页）—— `play/`

全部为真实操作录屏：打开角色聊天 → 逐字输入用户消息 → 回车 → **SSE 流式逐字回复完整一轮**
（能清楚看到消息增长与「停止生成」按钮，即流式教学点）。H.264（ffmpeg libx264 **crf 23**），
1920×1080 @30fps，无音轨（screencast 静默捕获）。

| 文件 | 内容 | 角色/场景 | 时长 | 用页 |
|---|---|---|---|---|
| rpg.mp4 | 跑团 GM：掷骰检定（🎲 d20=17+3=20 成功）+ 探索状态栏 + 行动选项，游戏 UI 皮肤 | 地下城守望者·凯尔 | 32.5s | ⑮ |
| tutor.mp4 | 语言陪练：学生英语病句 → Emma 先肯定再温和纠错（went/bought 不规则动词）+ 中文提示 + 布置练习 | Coach Emma 语言陪练 | 36.1s | ⑮ |
| coauthor.mp4 | 小说共创：用户接龙一句 → 玄青续写玄幻《剑问青冥》一段 + 回交接龙钩子 | 玄青笔友·小说共创 | 33.8s | ⑮ |

## 角色卡（体验站导入用）—— `cards/`

| 文件 | 内容 | 来源/版权 | 用途 |
|---|---|---|---|
| default_Seraphina.png | Seraphina 官方示例卡（400×600 PNG 内嵌 V2 卡数据） | SillyTavern 主仓库 `default/content/`，随 ST（AGPL-3.0 发行）分发 | ⑭ 截图对话 / 体验站 |
| content_Assistant_CapoGPT.png | 官方助手卡 CapoGPT | SillyTavern-Content 仓库（MIT License） | 体验站 |
| contest_Assistant_Amy.png | 官方助手卡 Amy | 同上（MIT） | 体验站 |
| default_CodingSensei.png | 官方卡 Coding Sensei | 同上（MIT） | 体验站 |
| default_FluxTheCat.png | 官方卡 Flux the Cat | 同上（MIT） | 体验站 |
| demo_kyle_gm.json | 跑团 GM 卡「地下城守望者·凯尔」（V2 JSON） | **自创**（ST-PRE 社团演示，无第三方版权） | ⑮ rpg.mp4 / 体验站 |
| demo_Coach_Emma.json | 语言陪练卡「Coach Emma」（V2 JSON） | **自创** | ⑮ tutor.mp4 / 体验站 |
| demo_xuanqing_writer.json | 小说共创卡「玄青笔友」（V2 JSON） | **自创** | ⑮ coauthor.mp4 / 体验站 |

## 演示基建 —— `tools/`

| 文件 | 内容 |
|---|---|
| mock-llm.mjs | OpenAI 兼容流式 mock LLM（`MOCK_CHUNK_MS=85 MOCK_CHUNK_CHARS=2 node mock-llm.mjs`），三场景预置台词 + Seraphina 上下文变体；ST 端配置「自定义（兼容 OpenAI）」端点 `http://host.docker.internal:9999/v1`，API Key 随意填（如 sk-mock-local），模型 `st-pre-mock` |

## 残项 / 备注

- ** persona 头像**：演示 persona「旅人」未设置头像，聊天中显示 ST 默认「?」——这是新用户的真实默认态，按实拍原则保留。
- **录屏无音轨**：教学点是「流式逐字」，无需配音；如需配音由主线另行处理。
- **headless 录制限制**：agent-browser 在 headless 模式下 `record` 无法捕捉页面动态变化（整段静止），三段实录均以 **headed 模式**重录成功。复现时注意带 `--headed`。
- **官方卡数量**：官方渠道可分发的角色卡共 6 张（SillyTavern-Content 5 张 + 主仓库 Seraphina 1 张），本清单收录 5 张；demo 三卡为自创补充（对应三种玩法场景）。
- 本目录 `gen/`、`qr/` 为并行会话（主线 deck）产物，不属于本批次，未纳入本次提交。
- mock 服务已在本机 **9999 端口持续运行**（nohup，日志 `/tmp/mock-llm.log`）；主线 deck 的 LIVE 模式可直连，停掉可 `kill $(lsof -ti:9999)`。
- ST 容器 `st-pre`（volume `st_pre_data`）保留供体验站/复拍使用；`docker rm -f st-pre` 可清理。
