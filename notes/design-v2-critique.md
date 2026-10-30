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
