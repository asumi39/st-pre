# v2 页面 · design-taste-frontend 评审与打磨记录（2026-10-30）

> 依据：`references/critique.md` 十四遍法 + Awwwards 四维评分。对象：`web/index.html`（生产 0484640）。
> 门禁基线：lint 0 FAIL / inspect 三视口 0 FAIL（WARN×2 已留痕：品牌羊皮纸墨色、clamp 流式字号档）。

## ROUND 1

```
Seen in one second: 巨大的琥珀烛焰形 + 宋体大标题「今晚，酒馆开张」——一家暗色酒馆开门。
Idea (one sentence): 烛焰母题贯穿全页：页面就是那家深夜酒馆，知识点随章节「点灯」。
Live thing: 老板真流式对话（SSE 真大脑、离线回退罐头）+ 上下文窗口模拟器。
Layout words by section: hero=split / hook=statement+chat / brain=split / sim=control-rig /
  tavern=inset-panel / menu=two-col-menu+video / anatomy=diagram / openup=statement+picker /
  rules=checkerboard(bug!) / faq=cards / spoils=words+grid / footer=mark(读作柱状图)
Scores: design 7 · usability 7.5 · creativity 8 · content 8 → overall 7.4
Caps applied: 无硬性 cap；design 停 7 因 pass-11（纪律带/页脚两屏松散）与 pass-8（深色特写读作色块）。
```

### Top problems（按可见度排序）

1. **纪律带棋盘布局 bug**（desktop-page-03 第4屏 / tail-faq）：`.rules .wrap` 是 4fr/7fr 网格，
   h2 + 3 条 .rule 四个子元素自动流成 2×2 —— 第二条规则挤进标题下方窄列；标题「三条纪律」
   在窄列折行成「三条 / 纪律」孤行。→ 重构：标题左列独占，三条规则包进右列容器；标题列加宽。
2. **解剖图三区对比度过低**（desktop-page-03 / mobile-page-02）：散料格 #4a3a24 对 #1e1610 底
   几乎不可见，读作噪点；「收集→装配→回流」的知识叙事在截图里不成立。→ 提亮散料双色、
   格子尺寸做出节奏、两区之间加琥珀汇流箭头。
3. **开张段左列失衡**（desktop-page-03 第3屏）：右列 9/17 长截图 ~700px 高，左列文字 ~160px
   垂直居中，左上留大空洞。→ route-row + 详情 + after 全部收进左列，右图收窄至 280px。

### 次级问题（同轮一并修）

- 菜单特写/大脑大图过暗读作色块：per-image `brightness()` 提亮（brain-photo 1.35、面板截图
  1.45、ui-skin 1.6、ui-desktop 1.55、worldbook 1.45、ui-mobile 1.35）。
- 页脚大标记读作「水滴 + 柱状图」：wax 条重绘为五支带焰蜡烛（SVG，烛焰 flicker 微动，
  reduced-motion 关闭）——母题回归「烛」。
- 手机端「发送」按钮折成两行：`white-space: nowrap`。
- hero lede / 开张句孤字行（「走。」「脑。」）：`text-wrap: balance/pretty` 渐进增强。
- FAQ 卡列右缘 ~300px 空洞：max-width 880 → 1020。
- 序幕行内缩略图 1.5em 读作噪点：放大至 2.1em、圆角加大。

## ROUND 2（修复后复评）

```
Seen in one second: 琥珀烛焰 + 「今晚，酒馆开张」；纪律带左右分立；页脚成了五支蜡烛的烛台。
Idea (one sentence): 烛焰母题贯穿全页：页面就是那家深夜酒馆，知识点随章节「点灯」。
Live thing: 老板真流式对话（SSE 真大脑、离线回退罐头）+ 上下文窗口模拟器。
Layout words by section: hero=split / hook=statement+chat / brain=split / sim=control-rig /
  tavern=inset-panel / menu=two-col-menu+video / anatomy=diagram(三幕可读) /
  openup=statement+picker(平衡) / rules=split(修复) / faq=cards / spoils=words+grid /
  footer=mark(candelabra)
Scores: design 8 · usability 8.5 · creativity 8 · content 8 → overall 8.2
Caps applied: 无。
```

### 修复确认（对照 ROUND 1 三大问题）

1. 纪律带：标题独占左列一行放下（clamp 26–40px），三条规则右列堆叠——棋盘消除。
2. 解剖图：散料双色提亮（#6b5531/#54401f）+ 尺寸节奏 + 两枚琥珀汇流箭头，
   「收集→装配→回流」三幕在桌面与手机截图里均可读。
3. 开张段：route-row/详情/after 全部收进左列，右图 280px 居中——空洞消除。

### 次级修复确认

- 菜单/面板/大脑图提亮后读作内容而非色块；页脚五支带焰蜡烛成立（flicker 微动，reduced-motion 关）。
- 手机端「发送」单行；开张句改「把酒馆装进你的电脑。」一行放下；菜单标题与标签分两行；
  hero lede「带走。」孤行消失（text-wrap pretty/balance）。

### 遗留软点（不影响发布，记录在案）

- 模拟器段底部与战利品段尾部留白偏宽（作为节奏性 rest，各一次，未超半屏）。
- 字号实测 15 档（新增 37px = 纪律带标题 clamp 插值），维持「流式排版必需」辩护。
- FAQ 卡列右侧 ~180px 空气（标题与卡片同左缘，读作呼吸而非偏挤）。

## ROUND 3 · 细节排查（用户要求逐端逐节复查，2026-10-30）

桌面 1440 与移动 390（inspect 仿真）/500 逐节截图走查，修复 8 项：

1. **页脚标记在 390px 被无声裁切**（真 bug，body overflow-x:hidden 掩盖）：焰形+烛台
   总宽 2.34×mark 高，22svh 高度下需 453px > 可用 327px。→ ≤700px 限高
   `clamp(90px, 24vw, 132px)`；Firefox 真 390 视口实测 markRight=359<390、scrollWidth=390。
   （chrome-devtools 窗口最小宽 500px，390 只能靠 inspect 仿真 / Firefox set_viewport_size。）
2. **Hook 右半空洞**（桌面 ~580px）：聊天窗左置、旁注原在窗下。→ hook-stage 改双列，
   `#chatNote` 移右列底对齐，成为旁注栏（≤860px 回落单列）。
3. **开张段 statement 与路径行间 ~250px 空档**：statement 收进 open-grid 左列首行。
4. **战利品收束句位次**：先移至段尾 → inspect 判「QR caption 在大标题上方=eyebrow」FAIL
   （768/390），回退至 spoil-grid 之前；收尾节拍由琥珀页脚承担。两版均留痕。
5. **FAQ 五张卡抽屉层次**：桌面端 2/4/5 卡同色、层叠感失效；答案行孤字「始。」。
   → 五级递进卡色（#1e1610→#362a17），子元素透明化 + 打印回退；`p { text-wrap: pretty }` 全局化。
6. **菜单两枚深色特写再提亮**（群聊 1.5、插件货架 1.75）。
7. 讲者面板（N 键）、模拟器 4/8/12 三态、FAQ 手风琴、聊天回放完成态——交互走查全部正常。
8. 复验：lint 0 FAIL / inspect 三视口 0 FAIL；同源讲义重生成（12.1MB）。

### 390px 特记

- chrome-devtools 窗口最小宽 500 → 移动细节以 inspect 仿真截图 + Firefox set_viewport_size(390) 实测为准。
- 罐头回放完毕的聊天（chip「离线回放·完」）、菜单标题/标签分行、开张句单行——390 下均确认。


## ROUND 4 · 动效升级 v3.1（用户：美观优先、不为加而加；点名给大水滴做动效，2026-10-30）

方案历经交互提案页（10 项全选）→ 用户反馈修订（知识点绑定降级为加分项；砍 C2 数字滚动、
C3 指针视差）→ 大水滴 A/B 实测页（真实原图，选 B）→ 实施。最终 9 项：

1. **D1 大水滴（第一幕 cover-hero 焰形大图）**：结构改为 drop-stage(clip) > drop-inner(-26px
   外扩防露边) > img+光斑+光漾。入场光自吧台反光处漾开一次（section-lit 触发）；光斑
   5.2s 常驻呼吸（与 hero 焰同频）；±18px 滚动视差（rAF 合并循环）。实测页阶段发现主蜡烛
   在裁剪切外、暖光落在吧台——光效落点据此定在吧台光斑；「远处烛影」层渲染成雾球，删除。
   强度初版被 A4 暗角压住，alpha .55→.68 / 呼吸 .6↔.95 找回存在感。
2. **A1 开场点火**：纯 CSS 编排 spark(.1s)→焰 ignite(.4s)→标题(.45s)→lede(.85s)→按钮(1.15s)
   →cue(1.5s)。inspect late-title 门要求标题 1.2s 可读，编排从 1.75s 压到 1.2s 内完成。
3. **A2 解剖图方向性**：散料(sc)/装配(bd)/回流(ot) 分类，bd/ot 自 +14px 位移错峰入场；
   箭头改虚线 + dashFlow 行进（busy 时 .45s 加速）。SVG 构建函数加 cls 参数。
4. **A3 全屋烛光同频**：setBusy() 挂 SSE/罐头发送全路径（含中断/回退出口）；body.busy 驱动
   三读者——hero 焰换 1.1s heroBusy、水滴光斑 dropGlowB、页脚烛台统一 1.2s。
   真实 DeepSeek 流式回归：busy true→false、chip 状态、消息落地全部正确。
5. **A4 滚动光位**：body::before/::after 双 fixed 层（暖光 .12→.6 / 暗角 .5→.13），
   scroll-timeline 驱动 + rAF 兜底写 CSS 变量。**初版用真实 div 层 → inspect covered-text
   FAIL**（强制 hit-test 下全屏层拦下一切大字取样点）；改伪元素后命中返回 body（含文本即
   跳过），门禁恢复 0 FAIL。这是本轮唯一结构性返工。
6. **B1 统一错峰**：.rise 固定 d1–d4 → `transition-delay: calc(90ms * var(--i))`，d1–d4 映射
   兼容存量 HTML；data-stagger 容器（rule-stack/points/两个 menu-list/faqCards）子项 JS 统一
   注入 --i 并入 IO 观察。3s 安全网语义不变。
7. **B2 烛台错相+阵风**：移除五烛内联 delay，CSS 全权编排（2.5–3.4s 各异 + 负 delay），
   第 4 烛换 6.5s gust（偶发阵风）。Firefox 截图确认五焰形态各异。
8. **B3 流式光标**：`.typing::after/.streaming::after` 琥珀 caret steps(2) 闪烁。修正时序漏洞：
   罐头剧本原先在打字前就摘掉 .typing → 新增 .streaming 状态跟住 typeInto 全程；伪元素
   计算样式确证（8.8×16.8 琥珀块 + caretBlink）。
9. **C1 切换过渡**：FAQ .answer max-height/opacity 过渡（小卡片白名单，注释留痕）；
   routeDetail 150ms 淡入换装；chat-modes/routes 按钮颜色过渡。

### 工程红线执行

- Composite-only：全部 transform/opacity；白名单例外仅 A2 dashoffset（小面积 SVG）与 C1
  max-height（小卡片），代码内注释留痕。两个 scroll listener 合并为单 rAF 循环
  （进度兜底/顶栏/光位兜底/视差四合一）。零新依赖、零新资源、图片预算 8/8 不动。
- reduced-motion：新增动效全部纳入 431 行块（点火/光斑/光漾/箭头/烛台/caret/视差关，
  bd/ot 强制可见，body.busy 读者全部静止）。
- print：光位层（body 伪元素）、水滴光效、spark 全部关闭；解剖图打印强制全亮
  （bd/ot 否则 opacity:0 不可见——打印修复）。
- gradient 规则：5 处烛光光效为「灯光」非装饰渐变，lint 同行注释豁免 + inspect 走
  direction.json allow（图纸级留档）。

### 复验记录

- lint 0 FAIL（1 WARN 为既往 em-dash 计数）；inspect 1440/768/390 **0 FAIL**，2 WARN 与
  Round 3 完全一致（palette-cream 羊皮纸、15 档流式字号——均已辩护）。
- Firefox 真 390：scrollWidth=390，视差激活，hero 标题入场完成态 opacity=1。
- Chromium 目检：点火中途/落定两帧、水滴光斑、busy 态、解剖图回流中帧、caret 确证、
  页脚错相帧。
- 真实 LIVE 一次（¥0.002）：busy 链路端到端正确。
- 讲义重生成（12.0MB）与页面同批 rsync 上线；线上 grep 确认新标记 8 处。

### 遗留软点（记录在案）

- 大水滴光斑与 A4 暗角存在轻微互相稀释，强度已调平；若教室投影仍偏暗，可再加
  `--glow-vig` 终值（现 .13）一档。
- A4 光位在 NoScript/无 scroll-timeline 环境走 rAF 兜底，首屏前 0.5s 内光位为静态初值
  （.12/.5），属预期。

## ROUND 4b · 动效幅度调校（用户反馈「很多动效不够明显」，2026-10-30）

全案幅度上调一档半，门禁不变（lint 0 FAIL / inspect 0 FAIL / 2 WARN 同前）：

- **D1**：光斑渐变 .68→.78、半径 52×46→58×52%；呼吸 .6↔.95→**.45↔1**、scale 1.08→1.14；
  光漾 1.6s→2s、终点 scale 1.28→1.5；视差 ±18→**±30px**（inner 外扩 26→34px 防露边）。
- **A1**：火星 10→14px、峰值 scale 1.6；焰入场换过冲缓动 cubic-bezier(.3,1.35,.4,1)；
  文字位移 16→22px。
- **A2**：bd/ot 位移 14→**26px**、时长 .8s；散料基准透明度 .55→.4（点亮对比更强）；
  箭头 3→4px、虚线 10-6、行进 .9s→.6s。
- **A4**：暖光 .12→.6 改 **.08→.8**、暗角 .5→.13 改 **.55→.06**，并加平滑阶跃缓动
  （CSS cubic-bezier(.6,0,.4,1)，JS 兜底 smoothstep）——整页线性变化难感知，中段坡度更陡。
- **B1**：.rise 位移 26→34px。**B2**：flick scaleY 1.06→1.1；阵风 6.5s→4.6s、-14°→-19°；
  busy 烛台 1.2s→0.9s。**A3**：heroBusy 摆幅 ±1.6°→±3.4°；新增 busy 时 chat-chip 呼吸
  （RM 已同步豁免）。
- 讲义不重生成：本轮改动全部为动画参数，打印输出与上一版逐字节一致。

## ROUND 5 · 换实现 + 引导漏斗（用户：①一些动效要换更明显的实现而非调参 ②站外引导太弱，2026-10-30）

### ① 三处结构性换实现

1. **大水滴：快门式揭幕**（原只有光斑呼吸+视差，入场存在感弱）——drop-shutter 包层
   `clip-path: inset(100% 0 0 0) → inset(0)` 自下而上揭开 .95s，图内 1.12→1 沉降 1.5s。
   触发与 section-lit 解耦：stage 自身 IO threshold 0.06 即开 + 3s 安全网强制 .open
   （inspect 快速滚动下第 3 屏曾因揭幕未开被判 empty-screens FAIL，此改动同时修掉它）。
2. **解剖图：流动光点取代虚线行进**——两支 r=5.5 琥珀光珠沿箭头飞行（rAF 循环，仅解剖图
   入视口时运行），淡入淡出两端；busy 时周期 900→380ms。虚线保留为静态纹理。
3. **顶栏「章节点烛」**——六个小焰（对应六幕）常驻顶栏，读到哪亮到哪（IO threshold 0.12，
   永久 lit + nflPop 过冲弹跳）。把「进度=亮度」从环境暗角（无人感知）变成可见计数器。

### ② 站外引导漏斗（四级 + 常驻出口）

- **常驻**：顶栏右上「上手指南」琥珀 CTA（≤560px 收起导航只留 wordmark+CTA，390 实测无溢出）
- **hook**：demo 旁注加出口行「想边看边装？上手指南五分钟入门」（chat-note 包进 hook-side 列）
- **第五幕**：route 区新增 guide-banner 大横幅（焰形图标 + 标题 + 域名 + 前往↗，琥珀底
  无边框——1px 描边触发 outlined-box WARN 后去除）
- **散场**：QR caption 加域名明文 tavern.phuyu.cloud/guide（不扫码也能到达）

### 门禁与记录

- lint 0 FAIL（1 WARN 同前）；inspect 1440/768/390 **0 FAIL**，3 WARN（2 项既往辩护 +
  outlined-box 已消除后回落 2 项）。
- Firefox 真 390：scrollWidth=390，topbar 无溢出。
- 目检：顶栏点烛进阶（解剖图帧 5/6 亮、第五幕帧 6/6 亮）、双光点飞行中帧、揭幕开启、
  横幅、QR URL。
- 讲义重生成（内容有新增文字）与页面同批上线。

## ROUND 5b · 老板试用合二为一（用户：离线回放/接真大脑不该让观众做选择题，2026-10-30）

- 删除 chat-modes 双按钮组（HTML/CSS/print 引用一并清理）；发送路径统一：**能连真大脑
  就现编，失败/超时自动回罐头**——fetch 加 AbortController 6s 超时，回落改用 typeInto
  打字机（带 .streaming caret），chip 全程如实报告：真大脑·生成中 / 真大脑·在线 /
  离线罐头·断网。
- 旁注重写：「老板有两副嗓子……同一副界面，换一颗大脑——这就是前端」（原教学点保留，
  选择成本归零）。开场自动回放保持罐头（免费、必成功）。
- 双路径实测：真大脑（localhost 代理，回复在角色内、chip 在线）✓；断网（liveurl 指向
  关闭端口，即时回落、打字机罐头）✓。
- 门禁 lint/inspect 0 FAIL；讲义重生成上线。

## ROUND 6 · 移动端动效重排（用户反馈「桌面还好，移动端很糟糕」，2026-10-30）

诊断先行：桌面 Chrome 满帧不代表手机——真正的受害者是 iOS Safari 路径
（无 scroll-timeline → JS 兜底）。逐帧审查找到六处病灶，全部按小屏规律重排
（新增 `@media (max-width: 700px)` 动效减负块，置于 RM 块之前保证减弱动效恒胜）：

1. **全屏光位层逐帧重绘**（头号）：JS 兜底每帧写 body CSS 变量=整树样式重算
   + 两层全屏渐变重绘。→ 伪元素加 `will-change: opacity`（合成器接管）；
   ≤700px 光层静态化（暖光固定 .3，暗角整个砍掉——小屏上暗角直接罩正文，
   桌面它只罩边缘留白）；JS 变量写入门控 `wideMQ`。
2. **视差每帧 gBCR**：强制布局 + 大面积 SVG 裁切图层 transform。→ ≤700px
   停用视差（转档清残留 transform），桌面保留。
3. **顶栏 backdrop-filter: blur(10px)**：内容滚过每帧重算模糊。→ blur 收进
   `@media (min-width: 701px)`，小屏不出现该属性（顺带消掉 glass WARN，
   lint 回落 1 WARN）。
4. **解剖图在手机上根本没点亮**（截图实锤 bug）：section-lit 用 ratio 0.12，
   手机段落高数千 px，844 视口最大相交 ~10%，阈值永远够不到 → 装配/回流
   色块 opacity:0 藏着，页面读作「图挂了」。→ 高瘦段落改「段落顶进入视口
   下 1/3 即点亮」（rootMargin 0 0 -35% / threshold 0），桌面维持 0.3。
5. **缩放后动效不可见**：1244 单位宽 SVG 在 390 屏缩到 0.29 倍——光点 1.5px、
   虚线噪点。→ 光点 r 5.5→12（加载时按屏宽取值）、箭头 stroke 4→7 +
   dasharray 16 9（CSS 压过 SVG 属性）。
6. **手机开场没有点火**：hero 焰 animation:none、spark 隐藏。→ 移动块补
   one-shot heroIgniteM（scale .5→1 + fade，.7s）；busy 摆焰仍不做（大图层
   持续重绘）。快门揭幕 .95→.7s、图沉降 1.12→1.07/1.1s；水滴光斑换
   dropGlowM 温和档（6.8s，scale ≤1.06）。

### 附带修复与验证

- RM 块历史遗漏：`body::before/::after` 滚动联动未受 reduced-motion 约束，
  补 `animation: none` + 静态值（.3/.25）。
- 顶栏 solid toggle 加状态守卫（同值不写 class）。
- 500px（移动分支）行为断言：视差 none、暖光静态 .3/无动画、暗角 none、
  blur none、光点 r12、点火完成后 opacity 1。1440 断言：视差在跑、warmUp
  联动、blur 回归。
- 解剖图 500px 实拍：三组色块齐亮、光点飞行中帧、正文清晰。
- 门禁：lint 0 FAIL / inspect 三视口 0 FAIL（2 WARN 既往辩护）。
- 讲义不重生成：本轮零内容文字变更，打印输出不变（打印宽度走桌面分支）。
- 测量注记：桌面 Chrome 500px 滚动探针 16.7ms 满帧（改造前后同）——桌面
  GPU 本就无感；本轮消的是 iOS Safari 的每帧重绘/整树重算/强制布局，行为
  断言为准。

## ROUND 7 · 实拍实录切换交互重做（用户反馈「三种场景切换的交互逻辑不明显」，2026-10-30）

旧实现的问题：选中态只有缩略图 2px 描边（焰形裁切下几乎不可见）；菜单位没有任何
「点了会换片」的暗示；点击后视频在视口外悄悄换源——因果链完全不可感。

三管齐下：

1. **选中态成体系**：琥珀左标（::before 竖条，scaleY 入场）+ 行底 13% 琥珀染色
   （padding/margin 负值手法不挤布局）+ 缩略图播放徽标（hover/focus 浮现，选中常驻
   琥珀底）+「正在放映」小标。旧描边规则废弃。
2. **点菜语义前置**：menu-cat 提示语改「点一道菜，换一段实录 · 本机录制」。
3. **换片因果可见**：标题 #vidTitle 淡出换装（180ms）；放映框 .vid-frame 琥珀闪光
   一次（.55s，opacity only）；手机上放映框在视口外（bottom<80 或 top>vh-80）时
   scrollIntoView 平滑带到位——500px 实测 frameTop 871→237。

验证：点击断言（pressed 迁移/标题/vidSrc/swap class/now display/底色/左标全过）；
视口内 75% 可见时不滚动（判断正确）；RM 全静止 + print 隐藏徽标；lint/inspect
0 FAIL；讲义重生成（提示语属内容）。

## ROUND 7b · 模拟器滑杆触觉棘轮（用户问能否调动设备震动马达，2026-10-30）

可以，且已做——Vibration API（navigator.vibrate）：**Android 系浏览器支持，
iOS Safari 不开放马达**（feature-detect 后静默跳过，桌面无马达为 no-op）。

- 拖过每格（step=1 一条消息）短震 9ms——棘轮滴答感
- 旧消息被挤出窗口（n > CAP=6，.risk 态）改双击警示 [12,50,22]——体感「它忘了」
- 同值去重（连续 input 不重复震）；触发需用户手势，滑杆拖动天然满足
- 间谍函数验证节奏：[9,9,(同值无),[12,50,22],[12,50,22],9] 精确匹配

讲义不重生成（纯 JS）；lint 0 FAIL。

## ROUND 7c · iPhone 触觉替代（用户追问 iOS 是否真的没办法，2026-10-30）

调研结论（Tavily）：iOS Safari 至今不实现 Vibration API，但 2026-03 社区发现
「隐形开关」技法——iOS 17.4+ 对 `<input type=checkbox switch>` 的开合有系统触觉
反馈，翻转即可借到马达。samdenty/ios-vibrator-pro-max（v3.0.3, ISC）是完整实现，
但其方式是把整个 body DOM 搬进巨型 label（MutationObserver 维持）——对本页的
讲者面板搬移/IO 揭示/display:contents 布局风险过高，不引入。

采用手工最小版（约 25 行，零依赖、零 DOM 手术）：

- 正文末尾一对隐形 switch+label（16px、opacity 0、屏幕外、pointer-events:none）
- haptic()：原生 vibrate 可用走原生（Android/桌面）；否则 label.click() 合成翻转
  借系统触觉；双击节奏用 setTimeout 第二次翻转
- iOS 限制如实注释：≤18.3 免交互；18.4 起苹果只认 click 授权且 1s 过期——
  点按/轻拖全程有效，长拖中段可能静音（平台限权，非 bug）
- 修了一轮 lint：1px 内联样式触发 [hairline]，改 16px+opacity:0 绕开

验证：开关交替翻转 ✓、屏幕外 ✓、无布局影响（scrollW 不变）✓；lint/inspect
0 FAIL；触觉本体只有真机可证，交用户 iPhone 验收。讲义不重生成（纯 JS/DOM 尾巴）。

## ROUND 7d · iPhone 拖拽触觉：开关叠指（用户实测「点按生效、拖拽永不触发」，2026-10-30）

通读 ios-vibrator-pro-max 源码（click-grant/movable/inputable）找到根因：
label.click 合成翻转依赖 click 授权，而拖拽全程既无 click 也无 touchend
（都在松手时）——授权窗永不打开，点按路径在拖拽中必然哑火。

库的拖拽解法是另一条路径（movable.js）：剥掉 range 的隐式指针捕获
（monkey-patch setPointerCapture），把一颗真开关垫到指下，每个 pointermove
翻转 direction（开关滑块跳边 = iOS 判为滑动切换 = 真实交互触觉），取值逻辑
由坐标接管（inputable.updateValue 同款换算）。

手工最小版（~90 行，仅 iOS Safari 激活）：

- slider pointerdown：创建/定位真开关 pill（28×12.4、opacity .001、z-60）、
  替换 set/releasePointerCapture、window 捕获段挂 move/up/cancel
- pointermove：pill 跟指重定位 + direction 翻转 + sliderFromX 坐标驱动取值
  （同步派发 input → renderSim/棘轮照常）
- pointerup：无位移视为点按 → 跳到落点；恢复原生捕获、pill 停到屏外
- 全程 try/catch，任何异常永久退回原生行为（dragHackOn=false）

验证（强制激活副本 + 合成 PointerEvent）：捕获拖拽期已替换 ✓、数值跟手
（60%→8 条、90%→11 条、readout 同步）✓、溢出 verdict/risk ✓、抬手恢复 ✓、
pill 停屏外 ✓；桌面路径不受影响（整块门控）✓；lint/inspect 0 FAIL。
真机体感待用户 iPhone 验收。

## ROUND 7e · 引入完整触觉 polyfill（手工叠指在真机上仍只响点按，2026-10-30）

用户 iPhone 实测 7d 的最小叠指仍拖拽无声。盲仿 iOS 内部行为到头了——改为
**完整引入 ios-vibrator-pro-max v3.0.3**（esbuild 打包 18KB 内联，零 CDN）：

- 激活门控：`!navigator.vibrate && maxTouchPoints>0 && (iPhone/iPad UA ||
  Macintosh)`。polyfillKind 自带版本判：非 Safari / 有原生 API / Safari<18
  一律零执行——桌面/安卓实测 body 未被劫持、无库 DOM。
- **配套迁移（iOS 上库会把 document.body 劫持为 label 根）**：全部 body 类与
  变量依赖搬至 documentElement——html.busy ×10、html.speaker-progress、
  documentElement.classList ×4、--glow-* 变量 ×2。CSS 后代选择器（.speaker
  .spk 等）从 html 匹配不变。
- 桌面回归：body 仍为 HTMLBodyElement、html.busy 生效（heroBusy 挂/卸）、
  滑杆/无溢出 ✓；lint/inspect 0 FAIL；页面 118KB。
- 自研叠指代码保留（canVibe 真时自然休眠），作为库失效时的点按后备。

真机验收点：①拖拽滴答 ②聊天发送/FAQ/讲者面板（N 键）/整页滚动在 iOS 上
无回归 ③库的 label 覆盖层是否有可见异样。若库也不响 → 该 iOS 版本无解，
回退点按版（保留）。

## ROUND 7f · 终局：撤库 + 拖拽听觉滴答（真机确认库也无声，2026-10-30）

用户真机终验：完整库在 iPhone 上依然「点按响、拖拽无声」。结合库作者 README
原话（18.4 起只有 click 算授权、拖拽不算、授权 1s 过期，「唯一能继续震的办
法是冻结主线程」）——**结论：iOS 18.4+ 网页拖拽触觉被平台封死**，库的两条
邪路（主线程冻结 / 后台弹窗）均不可接受于教学页。

收尾三件事：

1. **撤下内联库**（拖拽无增益；点按我们 25 行即可）+ 删自研叠指死代码，
   页面回落 98KB。documentElement 迁移保留（更稳健）。
2. **iPhone 拖拽改听觉滴答**：12ms/2100Hz 轻方波（gain .03），溢出双滴答；
   仅「无马达设备 + 拖拽中（位移>6px）」触发，点按仍走 label.click 马达，
   Android/桌面仍走原生 vibrate——三端各得其所。
3. **修复本轮引入的自伤**：polyfill 块切除时尾切错误留下 `<script>>`，
   主脚本语法错误整段未执行（本地坏、线上为库版未受累）。修复后 node --check
   过，模拟双路径零报错（拖拽 9 条/溢出判定 ✓、点按 5 条 ✓）。

门禁 0 FAIL。iPhone 最终形态：点按=真马达，拖拽=轻滴答音。若教学现场不欲
出声，音量一行可调（gain .03）或注释 audioTick 调用退回纯静音。

## ROUND 8 · 手势契约（用户问「为何商业页不触发原生手势」，2026-10-30）

根因：浏览器默认把网页当文档——下拉刷新/双击缩放/橡皮筋/横滑翻页全是文档
默认值。商业页不是更 native，而是显式声明了手势契约（viewport + touch-action
+ overscroll-behavior + 定向 user-select）；我们一条没写，所有默认值全生效。

落地三声明（特稿页 + 指南页 v3）：

1. `overscroll-behavior: none`（html+body）——下拉刷新（Chrome Android 演示中
   误拉=整页重载）、过滚弹跳、触控板双指横扫=历史翻页（讲义场景大忌）出局
2. `* { touch-action: manipulation }`——双击缩放出局（快速点发送/FAQ 不再
   呲一下放大），**捏合缩放保留**（WCAG/低视力；iOS 亦无视 user-scalable=no，
   不做自欺声明）；滑杆 `touch-action: none` 独占手势（竖直抖动不滚页）
3. 控件定向 `user-select: none` + `-webkit-touch-callout: none` +
   tap-highlight 透明——长按按钮/滑杆不呼出菜单选区；正文与聊天文字保留
   可选中（复制 AI 回复是功能）

明确不做的：user-scalable=no（iOS 无视、Android 伤低视力）；iOS 边缘横滑
返回是系统手势，网页无权限——宣讲时若误触，系统级返回只能靠讲的时候避开屏幕边缘。

验证：computed style 全过（html/body none、button manipulation/none-select、
滑杆 none、chat input 与正文 selectable）；lint/inspect 0 FAIL；双页上线。

## ROUND 8b · iOS 双击缩放兜底（真机：manipulation 仍被触发，2026-10-30）

touch-action: manipulation 是文档正解（MDN/Andy Bell），但 iOS Safari 实现时灵
时不灵（版本/standalone 各有偏差，SO 有案）。补商业页实际发货的经典守卫：

- document 级 touchend 非被动监听：300ms 窗口内吞第二次 touchend（preventDefault）
  ——双击缩放没了第二次触摸就没有燃料；捏合不受影响（低视力保留）
- 代价：极速连点第二次 click 不再产生——本页无双击交互，无损
- 语法检查 + 桌面冒烟（FAQ/滑杆照常）+ lint/inspect 0 FAIL
- 附注：iOS 动了 CSS 但仍见缩放，先排除 HTML 缓存（Safari 激进；书签/恢复标签页
  常给旧 DOM），刷新方式：地址栏刷新或清 Safari 网站数据

## ROUND 8c · 安卓触觉排查 + 诊断模式（用户转达安卓「无法触发震动」，2026-10-30）

规范核实（Chromium issue #463717316 官方回复）：Vibration API 允许 sticky user
activation——页面任何首交互后即可随时震。代码路径无问题（滑杆交互天然满足）。

两大嫌疑与处置：

1. **9ms 低于感知阈**（头号）：不少安卓马达转子启动就要 10-20ms，9ms 单脉冲
   物理上可能不产生可感位移。→ 棘轮 9→20ms，溢出 [12,50,22]→[18,60,26]。
2. **设备环境**：静音/勿扰/省电模式、Chrome 站点设置禁振、WebView 内核阉割。
   → 新增诊断模式 **?haptic-test=1**：浮出自证面板（vibrate API 有无 +
   长震 400ms/溢出节奏/棘轮 20ms 三按钮，各显示 API 返回 true/false 与
   归因提示）。面板冒烟：按钮点击 → 日志输出 ✓；无参页面零执行 ✓。
   （adb 本机不存在，远程自证是唯一验证通道。）

门禁 0 FAIL。待反馈者在安卓设备打开 ?haptic-test=1 读结果回传。

## ROUND 8d · 安卓真机数据回传：短脉冲无感 → 45ms 档（2026-10-30）

诊断面板回传：长震 400ms 震 ✓；溢出节奏 [18,60,26] ✗；棘轮 20ms ✗；滑动 ✗。
定案：马达/权限/设置全好，**弱转子马达启动 30-50ms，短脉冲物理无感**。

- tick 20→**45ms**；溢出 [18,60,26]→**[45,70,45]**；加 70ms 节流（高频 input
  下 vibrate 每次重启 pattern，离散 tick 会被连成嗡鸣，节流保离散感；
  溢出越过 CAP 必震不受节流）
- 诊断按钮同步换新候选值（45ms / [45,70,45]），同一台手机可直接复验
- 待回传：45ms 按钮/溢出节奏是否可感 + 滑杆手感；若 45ms 仍无感 → 提 80ms
  或接受「滑动=连续嗡鸣」折衷

## ROUND 8e · 安卓触觉校准档（45ms 仍无感 → 90ms 默认 + 设备自校准，2026-10-30）

第二轮真机数据：45ms/[45,70,45] 仍无感，400ms 可感——该马达可感阈值远高于
常规。不再盲猜，改为「长脉冲默认 + 设备自校准」：

- 默认 tick 45→**90ms**，节流随档（VIB_MS+30），溢出 [VIB_MS,70,VIB_MS]
- 诊断面板新增**校准滑杆（20-300ms）+ 试震 + 设为滑杆档**：试震找个人阈值
  → 一键落 localStorage（vibTickMs）→ 即刻生效、按设备记忆，一次校准长期有效
- 冒烟：默认 90 ✓ / 校准 150 → 试震/落盘/即刻生效 ✓ / 滑杆不受扰 ✓；
  语法检查过；lint/inspect 0 FAIL

## ROUND 8f · 校准锁死修复 + 默认档 100ms（安卓回传：阈值 80ms、不校准就不震，2026-10-30）

回传钉死两个事实：阈值 80ms；「不用工具调整就不震」= 校准探索期间在低档位
点过「设为滑杆触觉」，低值持久化后覆盖默认档且无任何可见线索——设计缺陷，
不是玄学。

- 默认档 90→**100ms**（阈值 80 + 余量）
- 面板显示「当前生效 Xms（已校准/默认）」+ **恢复默认**按钮（清存储、
  VIB_MS 即刻回 100）——锁死类问题从此自证自解
- 冒烟：默认 100 ✓ / 80 落盘 ✓ / 手写 20 锁死后恢复默认清存储 ✓ /
  滑杆不受扰 ✓；lint/inspect 0 FAIL

## 指南页质感修缮 v4 + Firefox 字体故障根除（用户：整体质感不如主站，2026-10-30）

### 质感层重做（guide.css v4 / tokens v2，内容零改动）

诊断（taste-skill 实测）：lint 9 FAIL / inspect 8 项问题——14 个 1px 描边盒、
3 处虚线、emoji 当图标、mono 滥用、最大字号仅 31px、材料库（--surface/--shadow）
定义了未启用。病根：文档思维 + 继承的是已淘汰 v1 幻灯片的血统。

修缮清单（安静但不简陋）：

1. 填充面取代描边：卡片/FAQ/代码块/三件套全改 bg-2 系填充，三件套行间以
   2px 缝隙分隔，虚线全删；提示框改 3px 左色条 + 淡填充
2. 字阶敢大：h1 31→60px 宋体 display（全页唯一敢大的时刻），h2 31px clamp
3. 图标统一焰形母题：⚠/✓ emoji → 主站同源 #flame SVG（琥珀/余烬红），新增
   .fi 基类 + 内联 symbol；eyebrow 类整体退役 → hero-mark/sec-mark（焰形标记，
   sec 版移入 h2 内部规避 eyebrow 结构模式）
4. mono 减量：仅代码/URL/命令保留；meta-chip/lvl/dt/sig 全回正文字体
5. 节奏：正文行高 1.8、section 顶距 44px、8px 网格对齐；补 ::selection/
   :focus-visible；TOC 内边距 20px（390 edge-text）
6. 不加图片/动效/区块——质感来自做工，不来自复杂度

### Firefox 字体故障根除（过程中撞上的真 bug）

390 截图出现「假中文」乱码（DOM 字符串正确、Paint 错误字形、Chrome 正常）。
交叉实验定位：tokens.css 里 v1 遗留的 @font-face local() 声明——Firefox 把
local("PingFang SC") 解析到错误字体文件。系统字体无需 @font-face，四段全删 +
tokens v2 + 警示注释留档。Firefox 重启后乱码根除，Chrome 无回归。

### 门禁

- lint 0 FAIL / 1 WARN（em-dash 计数）；inspect 0 FAIL / 9 WARN——豁免三项
  （few-pictures/focal-point/still-page，文档页物种属性，命令行 --allow 留档，
  不写入项目 direction.json 以免放松主站门禁）；其余 WARN 均可辩护（card-rows=
  三条路径本就并列、palette-cream=品牌色、font-fallback=local 系统字体、
  off-centre=截图管线滚动条伪影、mixed-font-headline=标记入标题的设计意图）
- Firefox 390 截图：乱码根除、60px 宋体标题、焰形标记、填充卡片全部到位；
  Chrome 无回归；scrollWidth=390
- 上线：guide 三文件（index/tokens v2/guide v4）；主站无改动

## ROUND 8 终 · Pixel 真机全链路验证 + 静音模式元凶（adb + CDP + dumpsys 三层取证，2026-10-31）

用户提供 Pixel 6 Pro（Android 17，Chrome 154）+ platform-tools 接入项目。
三层取证全通，元凶与「安卓不能震」的所有报告彻底定案：

1. **系统层**：`cmd vibrator_manager synced oneshot 400/20` exit=0，用户有体感——马达/系统正常。
2. **API 层**：CDP（usb forward + chrome_devtools_remote）Runtime.evaluate：vibrate(400/100/20)
   全返回 true，无手势也 true（sticky activation）。
3. **合成真实触摸拖拽**：CDP Input.dispatchTouchEvent 驱动滑杆 4→11，遥测计数累加、
   溢出节奏 [100,70,100] 正确下发。
4. **系统台账（dumpsys vibrator_manager）抓真凶**：静音模式下 Chrome 的调用
   **从不进入台账**——渲染层返回 true、浏览器进程静默丢弃（Chromium：SILENT
   铃声模式拒振）。`cmd audio set-ringer-mode NORMAL` 后，同一次调用立即进账
   （com.android.chrome · 403ms · amplitude=1.00），合成拖拽后累计 **102 条
   Chrome 振动记录**，拖拽棘轮端到端抵达马达。

结论：**安卓侧页面代码从未有 bug**——「不能震」的设备都处于静音模式（Chromium
故意：静音拒振但 JS 返回 true，属 API 返回值不可靠的已知怪癖）。此前 45ms 无感
等数据来自另一台设备（真阈值 80ms），与 Pixel 无关。

页面侧唯一改进维持不变：诊断面板提示语已含「检查系统静音/勿扰/省电模式」
（网页无 API 读取铃声模式，无法自动检测）。校准机制（vibTickMs）继续覆盖
弱马达设备（另一台真阈值 80ms）。

验证工具留存：platform-tools/（adb）+ 诊断页 ?haptic-test=1 + CDP 拖拽脚本
（tmp，未入库）。诊断流程可复现：adb forward 9222 → /json → Runtime.evaluate +
Input.dispatchTouchEvent → dumpsys vibrator_manager 台账比对。

## ROUND 8 终 b · Chrome Android 解锁语义定案 + 双通道兜底（Pixel 真机实证，2026-10-31）

Pixel 6 Pro（Android 17 / Chrome 154，adb + CDP + dumpsys 三层）对照实验：
A 无点击直接拖 → vibrate 返回 false、马达 0 条；B 可信 click → +1；C click 后
拖 → +7；D 6s 后拖 → +8；E 21s 后拖 → +7。**语义定案：拖拽中的 vibrate 需要
会话里先有过一次「可信 click 内的 vibrate」；click 授权会话内长期有效（21s+
无衰减）**。调整一次后就能震=点按钮本身就是那次 click。

修复双通道：
1. **首次点击解锁**：document click（一次性）内补发 vibrate(1)（不可感），
   会话解锁——用户任意第一次点按（TOC/链接/任何按钮）后拖拽全程真马达
2. **拒绝可检测 → 听觉兜底**：未解锁时 vibrate 返回 false（可编程检测！），
   拖拽中检测到 false 自动落回 audioTick 滴答——直接拖也永远有反馈
3. 静音模式（上一轮）：返回 true 但马达不动，网页不可检测，提示语已覆盖

真机终验矩阵：清态拖=马达 0 条+音频兜底 ✓；任意点一下=解锁 ✓；再拖=马达
+7 条 ✓。三端最终形态：Android=点过一次后全程真马达（未点过=音频），
iPhone=点按马达+拖拽音频，桌面=原生 API。诊断面板保留（?haptic-test=1）。

## ROUND 8 终 c · 解锁语义判别（用户问「必须 click 吗」，Pixel 判别实验，2026-10-31）

判别实验（清态标签页 + CDP 真实触摸 + 台账时间窗）：中性点按（click 处理函数
内无任何 vibrate）即可解锁拖拽振动（+9 条/返回 true）——解锁条件 = 页面任意
一次可信点击，与点击内容无关；拖拽/pointerdown/合成点击均不算（全部实测排除）。
click 授权会话内长期有效（21s+ 无衰减）。

结论：已上线的「首次点击 1ms 解锁脉冲 + 未解锁听觉兜底」即平台约束下的最优解，
无进一步改动。iOS 18.4 同趋势收紧——两大平台正把「无点击的持续触觉」关掉，
网页触觉的未来形态就是「先点按、后触感」。
