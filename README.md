# CS2 Asset Library

集中管理 Counter-Strike 2 的 HUD 矢量图标、地图雷达、地图加载实景图，以及本地个人游戏截图。

## 目录

```text
assets/hud/                CS2 HUD 与 UI SVG
assets/radar-maps/         标准命名的地图雷达 PNG
assets/loading-screens/    1920×1080 地图加载实景图
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

PNG 文件体积较大，仓库计划使用 Git LFS 管理 PNG。首次提交二进制文件前，请先安装并启用 Git LFS：

```sh
git lfs install
git lfs track "*.png"
```

个人截图默认由 `.gitignore` 排除。如需同步个人截图，可移除对应规则后使用 Git LFS 管理。

## 授权

Counter-Strike 游戏资产属于 Valve Corporation。详细来源与使用提醒见 `SOURCES.md` 和 `LICENSE-NOTICE.md`。
