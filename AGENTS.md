# AGENTS.md · ST-PRE

SillyTavern 社团分享交付仓库。主体是**单文件 Web 特稿** `web/index.html`（约 2000 行，全部 CSS/JS/SVG 内联，无构建、无 package.json、零外部依赖），配套 `guide/`（上手指南）、`proxy/`（持 Key 的 SSE 反代，本地 ：3011）、`deploy/`（服务器配置与手册）、`slides/`（v1 deck 冻结归档，已下线，勿动）。生产站点 tavern.phuyu.cloud（GitHub 私库 asumi39/st-pre，直接 push origin main）。

## 铁律（违反=返工）

- **教室离线可放映**：零 CDN、零外部请求、零字体下载，`file://` 直开必须完整可用；LIVE 不可达自动无感回退罐头剧本
- **动效即知识点**：所有动效都在讲知识点，不加纯装饰动画
- **Key 零暴露**：`server.txt` / `deepseek-key.txt` / `imagegen.txt` 已 gitignore（服务器凭据在 server.txt），永不进仓库、不进日志
- **不为加而加 / 不降级**：升级要留痕（改了什么、为什么更好）
- **图像预算 8/8 已用满**：新增图片需用户裁定
- **每次设计/交互改动**在 `notes/design-v2-critique.md` 追加 ROUND 条目（决策 + 理由 + 验证证据）——「升级留痕」纪律，不是可选项

## 执行纪律（2026-11-07 自 PLAN.md 合并；v1~v2 执行方案原文见 git 历史）

- **遇阻让路**：某一步走不通时记录阻塞点与已试路径，转做下一个可执行部分；不原地卡死、不擅自换方案
- **残项上交**：完成后把残留阻塞项汇总为「现象 / 已尝试 / 影响范围 / 待决选项」提交用户裁定；裁定前保持原样
- **善用子代理**：相互独立的工作（调研、素材生产、设计探索）并行派发子代理，主线负责集成与最终一致性审查，产出按同等标准验收
- 「按图施工」「连续执行」随阶段 1~5 交付完成失效；「不降级，升级留痕」已并入上方铁律；服务器与公网暴露动作先确认（见文末「状态与待决」）。原 PLAN.md 的 LIVE 调用规格现存于 `proxy/README.md`「端点契约」，生产部署实况见「状态与待决」与 `deploy/README.md`

## 验证（改 JS/CSS 后必跑，顺序固定）

```bash
# ① JS 语法：主脚本内联在 index.html 里，先抽出再查
python3 -c "import re;open('/tmp/main.js','w').write(re.search(r'<script>(.*)</script>',open('web/index.html').read(),re.S).group(1))"
node --check /tmp/main.js
# ② taste 门禁（0 FAIL 才算过；WARN 留痕即可）
node ~/.agents/skills/design-taste-frontend/scripts/lint.mjs web/index.html
node ~/.agents/skills/design-taste-frontend/scripts/inspect.mjs "http://127.0.0.1:<PORT>/index.html?door=0" --widths 1440,390
# ③ 部署（密钥认证已配好，见 server.txt）
rsync -av web/index.html f@47.93.34.126:/opt/st-pre/web/
rsync -av guide/index.html f@47.93.34.126:/opt/st-pre/guide/
```

- 本地预览用 `python3 -m http.server`（agent-browser/openchamber_web 不吃 file://；后台起服务，测完记得杀）
- gate 例外：inspect 的 `empty-screens` 在 ?door=1 锁定页是误报；`gradient`/`text-shadow` 有豁免——allow 名单在 `.taste-skill/direction.json`，每条豁免都要在批判日志留理由

## 触觉系统（一个口径，勿加专属节拍）

- 全站唯一档位 = `netPat`（默认门口 90ms 单发），一个 pointerdown/click 委托按平台分挂（安卓 pointerdown / iPhone click）覆盖门、滑杆、一切链接按钮
- 用户校准入口 `?haptic-test=1`（候选试选 → localStorage `vibNetPat` 本机记忆）——校准一处，门/滑杆/交互网同步生效，勿给单个元素写第二档
- 平台现实：iOS 无 vibrate API（18.4+ 合成翻转只认可信 click，pointerdown 永不授权）；安卓 Chrome 首次 click 前振动被拒（有 1ms hapticUnlock 脉冲处理）；马达 80ms 以下无感，「轻嗒」要么 90ms 单发要么 PWM 短脉冲串（单发短嗒=没震）

## 测试

- **真机**（时序敏感的验证只信它）：Pixel 6 Pro USB + adb（`platform-tools/`）→ `adb forward tcp:9222 localabstract:chrome_devtools_remote` → CDP 脚本在 OpenCode 临时目录 `cdp/pixel-*.js`（依赖 ws 包）。三个坑：**先唤醒**（KEYCODE_WAKEUP + keyevent 82 + `svc power stayon usb`）；**Chrome reload 会恢复滚动位置**（量坐标前先 scrollTo(0,0)）；截图挂起多半是熄屏了
- **桌面**：agent-browser CLI（`set viewport 1440 900`）。openchamber_web 面板多 tab 会串台（localhost 与 127.0.0.1 算两个 tab，滚动和截图落在不同页）、视口会在调用间自行漂移——只单 tab 串行用；时序敏感的验证信真机
- URL 参数：`?door=0/1`（封面锁）、`?speaker=1`（讲者备注）、`?liveurl=`（真大脑地址覆盖）、`?haptic-test=1`；带 hash 进入自动跳过门锁

## 已知坑（多次踩过）

- `width`/`height` 属性会废掉 CSS `aspect-ratio`——改图框比例时两处要一致
- `guide/assets/tokens.css` 不得加 `@font-face` 的 `local()`（Firefox 乱码，v4 已修）
- 全局 3s 安全网强制揭示一切 `.rise`——首屏以下的入场动效实际是静态的，别指望它们
- body `overflow-x:hidden` 是潜在第二滚动容器（封门锁定态已强制 body visible）；Android Chrome 在 `overflow:hidden` 根下忽略 scrollIntoView——用 `window.scrollTo(0, top + pageYOffset)`
- 同一文件里同名类选择器的规则分处两处会互相覆盖（后者静默获胜）——改前先 grep 全部引用
- 讲义 `web/handout.pdf`（12MB）只在**内容**变化时重出；交互/样式轮跳过
- 截图落在 `.openchamber/screenshots/`，回复里用相对路径引用即可展示给用户

## 状态与待决

- 阶段 5 体验站（2026-11-07 **已上线生产**）：入口 https://tavern.phuyu.cloud/play/ ，fork 减法版
  st-lite（公开仓库 asumi39/st-lite，AGPL 合规；分支 st-pre-play，本地副本 ~/Documents/st-lite，
  服务器 /opt/st-pre/st-play）。生产组件：st-play-lite.service（:8000）+ st-play-playgate.service
  （:3012 持真 Key、并发 10、当日费用闸 15 元）+ nginx /play/ 块（zone=play 12r/s burst30）。
  default-user=管理员（密码在服务器 /opt/st-pre/st-play-admin-password.txt，600）。注册开放中（cap 80）。
  **关站流程**：sudo systemctl stop st-play-lite + config.yaml registration.enabled:false + 打包
  /opt/st-pre/st-play/data 留档（见 deploy/README.md §3）。特稿双码已上（web/assets/qr-play.png +
  页脚体验站链接与 st-lite 源码链接）。已知小项：demo 卡 mes_example 字段位置警告（不影响使用）；
  关站后 qr-play 二维码与页脚是否撤下待用户裁定。
- deploy/README.md 安全清单：sshd 禁密码、备份 cron——待用户决策
- 涉及服务器与公网暴露的动作（阶段 4+），执行前先取得用户确认
