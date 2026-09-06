# 12周举重训练 App

一个部署在 GitHub Pages 上的轻量举重训练网页 App，包含 12 周训练计划、进度追踪、动态 Max、日历映射、深蹲热身提示，以及 Mixed KG/LB 杠铃配重工具。

## 当前功能

### 训练计划
- 12 周举重专项深蹲 + 抓挺计划
- W1–W12 周标签与每周进度
- 12 周总进度：`X / 12 周`
- 一周全部项目完成后，对应周标签自动变绿
- 周一 / 周五双深蹲安排
- 周二 / 周四：抓举 / 挺举二选一
- 周二 / 周四：宽拉 / 窄拉二选一
- 辅助动作按训练日显示
- 每项可勾选完成状态
- 可记录实际重量 / 完成情况、RPE、备注
- 可导出训练记录

### Dynamic Max
顶部可设置：
- Back Squat Max
- Front Squat Max
- Snatch Max
- Clean & Jerk Max

应用新 Max 后，12 周计划自动换算：
- 深蹲重量按原计划相对强度缩放
- 深蹲重量四舍五入到最接近 2.5 kg
- 抓举 / 挺举百分比自动显示对应公斤数

### 周期日期
- 设置 Week 1 的周一日期
- 自动生成 W1–W12 日期范围
- 每个训练日显示实际日期
- 开始日期保存到浏览器 localStorage

### 深蹲热身
周一、周五深蹲主项前会显示热身建议。

当天第一个深蹲参考：
- 空杆 × 10
- 当天工作重量约 50% × 5
- 65% × 4
- 80% × 2
- 90% × 1
- 正式组

当天第二个深蹲会使用更短的热身流程。

注意：这里的百分比是 **当天工作重量的百分比**，不是 1RM 百分比。热身不计入周完成进度。

## Barbell Load / Mixed Plates

App 内集成了 Barbell Load 功能，可保存自己的杠铃片库存，并从训练计划里的重量直接打开配重计算。

支持：
- KG + LB mixed plates 同时使用
- 自定义已有 plate inventory
- 每种片可启用 / 禁用，并设置数量
- 左右两侧始终对称配重
- 20 kg、15 kg、45 lb 或自定义 bar
- 从训练计划中的目标重量点击“配重”查看配置

三种寻找模式：
- **最近**：选择与目标重量绝对差最小的合法组合
- **向下**：选择不超过目标重量的最近组合
- **向上**：选择不低于目标重量的最近组合

如果多个组合误差相同，会优先选择使用更少 plates 的方案。

## 数据保存
训练数据保存在浏览器 `localStorage` 中，包括：
- Max
- Week 1 开始日期
- 当前周
- 完成勾选状态
- 实际重量 / RPE / 备注
- 抓举 / 挺举选择
- 宽拉 / 窄拉选择
- Barbell Load inventory

因此数据是 **设备 + 浏览器本地保存**，不会自动同步到其他设备，也不会上传到 GitHub。

## 手机使用
在 iPhone 上可用 Safari 打开 GitHub Pages，然后：

1. 点击分享
2. 选择“添加到主屏幕”
3. 之后可以像 App 一样从桌面直接打开

项目包含 `manifest.webmanifest` 和 service worker，可提供接近 PWA 的使用体验。

## 项目结构
- `index.html` — 主页面框架
- `app.css` — 主训练页面样式
- `app.js` — 训练记录、日期、Max、周进度等逻辑
- `plan.js` — 12 周训练计划数据
- `warmup.js` — 深蹲热身显示逻辑
- `loader-integrated.js` / `loader-integrated.css` — 集成到训练计划中的配重工具
- `barbell.html` / `barbell.js` / `barbell.css` — 独立 Barbell Load 页面
- `manifest.webmanifest` — PWA manifest
- `sw.js` — service worker / cache

## 部署
当前通过 GitHub Pages 从 `main` 分支部署。

更新代码后：
1. Push / Commit 到 `main`
2. 等待 GitHub Pages 完成部署
3. 如页面仍显示旧版本，可进行一次强制刷新

---

这个项目最初只是一个 12 周训练计划网页，现在已经逐步扩展成训练记录 + 周期管理 + Mixed Plates 配重工具。