# 12周举重训练 App

## GitHub Pages 部署
1. 在 GitHub 新建一个 repository，例如 `weightlifting-plan`
2. 把这个文件夹里的所有文件上传到仓库根目录：
   - index.html
   - manifest.webmanifest
   - sw.js
   - icon.svg
3. 打开仓库 Settings → Pages
4. Build and deployment 选择：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. 保存后，GitHub 会给你一个 Pages 地址。
6. 用 iPhone Safari 打开该地址 → 分享 → 添加到主屏幕。

训练记录保存在当前浏览器的 localStorage。
如果更换浏览器、清除网站数据或换设备，记录不会自动同步。
建议偶尔用 App 内的“导出记录”备份。
