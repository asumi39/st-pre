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

