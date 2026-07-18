# CS2 Asset Library

集中管理 Counter-Strike 2 的 HUD 矢量图标、地图雷达、地图加载实景图，以及本地个人游戏截图。

## 目录

```text
assets/hud/                CS2 HUD 与 UI SVG
assets/radar-maps/         标准命名的地图雷达 PNG
assets/loading-screens/    1920×1080 地图加载实景图
assets/nades/              已整理的道具四件套、效果视频与结构化 manifest
assets/nades/**/_intake/   本地录入暂存区，不进入 Git 与素材索引
personal/screenshots/      个人游戏截图，默认不提交 Git
catalog/                   素材清单和本地浏览页
tools/                     索引生成工具
```

打开 `catalog/gallery.html` 可以浏览、搜索全部可发布素材；点击卡片可复制相对路径。

更新索引：

```sh
node tools/build-catalog.mjs
```

## Git

PNG、MP4 文件体积较大，仓库已使用 Git LFS 管理。首次拉取或提交二进制文件前，请先安装并启用 Git LFS：

```sh
git lfs install
git lfs track "*.png"
git lfs track "*.mp4"
```

原始录屏保留在 `personal/screenshots/`，录入过程文件保留在 `_intake/`；两者默认由 `.gitignore` 排除。通过审核的素材应按地图、阵营、道具、落点与投掷变体归档到 `assets/nades/` 的正式语义目录，再由 Git LFS 同步。`recordings/<日期时间>` 用于保存已发布但尚未命名为固定变体的历史录制，避免用 `_intake` 作为长期目录或重复提交原片。

## 授权

Counter-Strike 游戏资产属于 Valve Corporation。详细来源与使用提醒见 `SOURCES.md` 和 `LICENSE-NOTICE.md`。
