# T / CT 阵营图标

交给其他 agent 时，优先使用这两个固定颜色文件：

- `t_logo_gold.svg`：T 方，金色 `#F5B900`
- `ct_logo_gray.svg`：CT 方，灰色 `#92919D`

它们具有透明背景，在白色或深色画布中都能直接识别。

需要由代码控制颜色时使用：

- `t_logo_currentcolor.svg`
- `ct_logo_currentcolor.svg`

`currentColor` 版本适合内联 SVG，或作为 CSS `mask` 使用。通过普通 `<img>` 引用时，SVG 内部的 `currentColor` 不会继承外部元素的 CSS `color`，因此普通图片标签应优先使用固定颜色版本。

## HTML

```html
<img src="assets/hud/faction/t_logo_gold.svg" alt="T" width="40" height="40">
<img src="assets/hud/faction/ct_logo_gray.svg" alt="CT" width="40" height="40">
```

## CSS mask 动态着色

```css
.faction-icon {
  width: 40px;
  height: 40px;
  background: currentColor;
  mask: var(--icon) center / contain no-repeat;
  -webkit-mask: var(--icon) center / contain no-repeat;
}

.faction-t {
  color: #f5b900;
  --icon: url('./t_logo_currentcolor.svg');
}

.faction-ct {
  color: #92919d;
  --icon: url('./ct_logo_currentcolor.svg');
}
```
