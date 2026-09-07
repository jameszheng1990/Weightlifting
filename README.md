# 12周举重训练 App

一个部署在 GitHub Pages 上的个人举重训练网页 App。当前版本围绕 **深蹲突破 + 抓挺技术训练** 设计，包含 12 周周期、Dynamic Max、日历、逐组训练记录、热身 / 正式组独立计时、RPE Calculator、每日记录，以及双向 Barbell Load 计算。

## 当前功能

### 12 周训练计划
- W1–W12 周计划与实际日期
- W1–W3：**容量**
- W4：Deload
- W5–W7：力量
- W8：Deload
- W9–W10：强化
- W11：峰值
- W12：PR Test
- 周一 Heavy Back Squat 为第一优先
- 周五 Heavy Front Squat 为第二优先
- 周二 / 周四抓举或挺举二选一
- 宽拉 / 窄拉二选一
- Paused Back Squat 作为辅助，不作为第二个重后蹲日
- 每周完成进度和 12 周总进度
- 实际重量、逐组 RPE、备注
- 训练记录导出

### 当前 Max
默认：
- Back Squat：112 kg
- Front Squat：100 kg
- Snatch：50 kg
- Clean & Jerk：55 kg

可随时修改 Max 并应用到整套计划。

深蹲重量按原计划相对强度缩放，并四舍五入到最接近的 2.5 kg；抓举 / 挺举百分比自动换算公斤数。

## 周期日期
设置 Week 1 周一后，会自动生成：
- W1–W12 日期范围
- 每个训练日的实际日期
- 周一到周日的每日 Tab

## 逐组训练记录
每个有明确组数的动作都会显示独立的正式组按钮。

例如 `80 kg × 4组 × 6次` 会显示 4 个正式组按钮，每组都可以单独：
- 标记完成
- 记录 RPE

按钮完成后会变绿并保存到 `localStorage`。如果该动作带有热身，必须热身组和正式组都完成后，该动作才自动标记完成。

### W12 PR Test
PR Test 会把每次尝试单独显示，而不是误识别成普通组数。

例如 Back Squat PR Test：
`60×5 → 80×3 → 90×2 → 100×1 → 107.5×1 → 112.5×1 → 117.5×1 → 120×1`

每个 attempt 都可以单独完成并记录 RPE。

## 深蹲热身
主深蹲使用完整热身：
- 空杆 × 10，**只做 1 组**
- 当天工作重量约 50% × 5
- 65% × 4
- 80% × 2
- 90% × 1
- 正式组

第二个深蹲使用缩短热身。

这里的百分比是 **当天工作重量的百分比**，不是 1RM 百分比。

### 开始拉伸
第一个主项热身区，在空杆上方有 `开始拉伸` 按钮。

点击后：
- 开始当天总训练计时
- 开始该动作的热身计时
- 状态会保存，刷新页面后仍能记住已经开始
- 不计入热身组完成数

## 训练计时
当前使用正向 stopwatch，不使用组间倒计时。

计时分三层：

### 1. 本次训练总计时
页面底部浮动显示：
- 本次训练已用时间
- 暂停 / 继续
- 结束训练

### 2. 当天总用时
训练日卡片顶部显示 `当天总用时`。

### 3. 动作独立计时
每个动作独立记录：
- **热身用时**
- **正式动作使用时间**

例如：
- `Back Squat 热身用时 08:35`
- `Back Squat 用时 21:20`
- 总训练计时仍继续累计

完成一个动作、切换到下一个动作后，上一动作计时会停止，下一动作计时开始。

## 顶部导航
顶部主导航：
- **训练计划**
- **Barbell Load**
- **训练记录**
- **RPE Calculator**

这 4 个 Tab 在向下滚动时会 sticky 保持在屏幕顶部，并适配 iPhone safe area / Dynamic Island。

## 每日记录
训练计划内有 Mon–Sun 每日 Tab。

每天可以记录：
- `＋ 添加有氧`
  - 分钟
  - miles
  - 可添加多条
- 拉伸
- 肌酸

训练日完成条件：
- 当天原计划动作全部完成
- 拉伸完成
- 肌酸完成

休息日完成条件：
- 拉伸完成
- 肌酸完成

有氧为可选，不影响完成状态。

## Barbell Load
Barbell Load 现在有两个子功能。

### 目标重量 → 配片
输入目标重量，App 根据当前 plate inventory 计算左右每侧需要挂哪些片。

支持：
- KG + LB plates 混合使用
- 自定义 plate inventory 和每种片的对数
- 20 kg bar / 45 lb bar
- 可选 collars
- 单个 collar 重量可输入 kg 或 lb
- 左右对称
- 从训练动作直接点击 `配重`

计算模式：
- **最近**：绝对误差最小
- **向下**：不超过目标的最近组合
- **向上**：不低于目标的最近组合

误差相同时优先使用更少的 plates。

### 挂片 → 总重量
反向计算当前杠铃实际总重量。

可独立设置：
- Barbell：**45 lb 默认** / 20 kg
- Collars checkbox
- 手动输入单个 collar 重量
- collar 单位：lb / kg

然后输入每侧实际挂的 KG / LB plates 数量，App 自动计算：

`bar + 2 × collars + 左右两侧 plates = 当前总重量`

该子功能与“目标重量 → 配片”的 bar / collar 设置相互独立。

## RPE Calculator
独立的 `RPE Calculator` Tab，支持两种计算：

### 从一组表现估算 e1RM
输入：
- 重量
- reps
- RPE

输出 Estimated 1RM。

### 从 1RM 计算目标组重量
输入：
- 1RM
- 目标 reps
- 目标 RPE

输出：
- 理论目标重量
- 按 2.5 kg 四舍五入后的实际训练重量

## 训练记录
原来的“工具”已改名为 **训练记录**。

这里保留：
- e1RM
- 历史记录
- 趋势
- 训练用时
- JSON 备份 / 恢复

## JSON 备份 / 恢复
可备份包括：
- 训练 Max
- 周期日期
- 当前 Week
- 逐组完成状态
- 每组 RPE / 备注
- 训练日志与计时
- 每日记录
- Barbell inventory
- Barbell / collars 设置
- e1RM 相关数据

然后可在另一台设备重新导入。

## 数据保存
数据默认保存在浏览器 `localStorage`。

这意味着：
- 同一设备 / 浏览器会保留数据
- 不会自动同步到其他设备
- 不会自动上传到 GitHub

## iPhone 使用
Safari 打开 GitHub Pages：

`分享 → 添加到主屏幕`

之后可以像独立 App 一样从桌面启动。

页面已对 iPhone safe area 做适配：
- 顶部标题避开状态栏 / Dynamic Island
- sticky 主导航不会被系统状态栏遮挡
- 底部固定操作区避开 Home Indicator

## 项目结构
- `index.html` — 主页面框架与资源入口
- `app.css` / `app.js` — 核心训练页面、Dynamic Max、日期、计划渲染
- `plan.js` — 12 周训练计划
- `warmup.js` — 深蹲热身方案
- `set-tracker.js` / `set-tracker.css` — 热身 / 正式组逐组按钮、RPE、备注、PR Test
- `session.js` / `session.css` — 总计时、热身计时、动作独立计时、历史训练时间
- `stretch.js` — 开始拉伸按钮与状态保存
- `daily.js` / `daily.css` — Mon–Sun 每日记录、有氧、拉伸、肌酸
- `loader-integrated.js` / `loader-integrated.css` — 目标重量 → 配片
- `loader-reverse.js` / `loader-reverse.css` — 挂片 → 总重量
- `rpe-calculator.js` / `rpe-calculator.css` — RPE / e1RM Calculator
- `features.js` / `features.css` — 训练记录、e1RM、备份等
- `trend.js` — e1RM 趋势
- `manifest.webmanifest` / `sw.js` — PWA / Service Worker

## 部署
GitHub Pages 从 `main` 分支部署。

更新后如果手机仍显示旧版：
- 等待 GitHub Pages 完成部署
- 重新打开 / 刷新页面

---

这个项目目前已经从一张 12 周训练表，扩展成一个包含 **周期计划 + 逐组记录 + 双向配重 + RPE 计算 + 分层计时 + 每日习惯记录** 的个人举重训练 App。
