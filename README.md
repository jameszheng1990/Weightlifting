# 12周举重训练 App

一个部署在 GitHub Pages 上的个人举重训练网页 App：12 周训练计划、Dynamic Max、日历、逐组记录、训练计时、训练复盘、e1RM，以及 Mixed KG/LB 杠铃配重。

## 当前功能

### 12 周训练计划
- W1–W12 周计划与实际日期
- 周一 / 周五深蹲重点日
- 周二 / 周四抓举 / 挺举二选一
- 宽拉 / 窄拉二选一
- 辅助动作
- 每周完成进度和 12 周总进度
- 实际重量、RPE、备注
- 训练记录导出

### Dynamic Max
可设置：
- Back Squat Max
- Front Squat Max
- Snatch Max
- Clean & Jerk Max

应用后自动重算计划。深蹲重量按原计划相对强度缩放并取最接近的 2.5 kg；抓举 / 挺举百分比自动换算公斤数。

### 周期日期
设置 Week 1 周一后，自动生成 W1–W12 日期范围和每个训练日的实际日期。

## 逐组训练记录
每个有明确组数的训练动作都会显示独立的正式组按钮。

例如 `82.5 kg · 5×4` 会显示：
- 第 1 组
- 第 2 组
- 第 3 组
- 第 4 组
- 第 5 组

做完哪组就点哪组；按钮变绿并保存在 `localStorage`。全部正式组完成后，若该动作还有热身，则需要热身也全部完成，之后才会自动把该动作标为完成。

### 深蹲热身逐组记录
周一 / 周五深蹲会显示热身建议并可逐组点击记录。

当天第一个深蹲参考：
- 空杆 × 10 × **2 组**
- 当天工作重量约 50% × 5
- 65% × 4
- 80% × 2
- 90% × 1
- 正式组

当天第二个深蹲使用缩短热身流程。

这里的百分比是 **当天工作重量的百分比**，不是 1RM 百分比。

## 训练计时 / 训练复盘
旧的组间倒计时已停用，改为整次训练的 **正向计时 stopwatch**。

- 第一次点击完成任意热身组或正式组时自动开始训练计时
- 显示本次训练已用时间
- 可暂停 / 继续
- 点击 `结束` 后保存本次训练
- `训练复盘` Tab 显示历史训练记录：
  - 日期
  - Week / 训练日
  - 开始时间
  - 结束时间
  - 总训练时长
- 也可在训练复盘中手动开始训练计时

## Barbell Load / Mixed Plates
内置 Mixed KG + LB 配重工具。

支持：
- KG + LB plates 混合使用
- 自定义 plate inventory 和每种片的对数
- 20 kg bar / 45 lb bar
- 可选择是否使用两个卡扣
- 单个卡扣重量可设为 kg 或 lb
- 杠铃 + 卡扣全部计入总重量
- 左右始终对称
- 从训练动作直接点 `配重`

三种组合方式：
- **最近**：绝对误差最小
- **向下**：不超过目标的最近组合
- **向上**：不低于目标的最近组合

误差相同时优先使用更少的 plates。

## PR / e1RM
可根据实际重量、次数和 RPE 记录主要动作：
- Back Squat
- Front Squat
- Snatch
- Clean & Jerk

工具页显示最佳 e1RM、历史记录和趋势。

## JSON 备份 / 恢复
可备份训练 Max、周期日期、逐组完成状态、训练日志、e1RM、Barbell inventory、杠铃 / 卡扣设置等本地数据，并在另一台设备重新导入。

## 数据保存
数据默认保存在浏览器 `localStorage`，不会自动同步到其他设备，也不会上传到 GitHub。

## iPhone 使用
Safari 打开 GitHub Pages → 分享 → `添加到主屏幕`，之后可直接从桌面像 App 一样打开。

## 项目结构
- `index.html` — 主页面框架
- `app.css` / `app.js` — 核心训练页面与记录逻辑
- `plan.js` — 12 周训练计划
- `warmup.js` — 深蹲热身方案
- `set-tracker.js` / `set-tracker.css` — 热身与正式组逐组按钮
- `session.js` / `session.css` — 训练 stopwatch 与训练复盘
- `loader-integrated.js` / `loader-integrated.css` — Mixed Plates 配重工具
- `features.js` / `features.css` — e1RM、备份等附加工具
- `trend.js` — e1RM 趋势
- `manifest.webmanifest` / `sw.js` — PWA / service worker

## 部署
GitHub Pages 从 `main` 分支部署。更新后等待 Pages 完成部署；若仍显示旧版，刷新一次页面。

---

这个项目已经从一张 12 周训练表扩展成逐组训练记录 + 配重 + stopwatch + 训练复盘的一体化个人举重 App。
