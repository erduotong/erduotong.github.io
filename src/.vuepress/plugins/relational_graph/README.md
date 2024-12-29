# Relational_graph

## 使用

(1) 将Relational_graph添加到你的主题中，并像 [config.ts](https://github.com/erduotong/erduotong.github.io/blob/main/src/.vuepress/config.ts) 中的那样使用他

(2) 如果您使用该插件时，文档框架不是最新vuepress-hope-theme主题，你可能需要进行一些额外的操作

样式问题：

```css
/**
 * 如果您使用的不是最新vuepress-hope-theme主题，请在任意样式文件添加仿照下述代码补全css变量
 */
:root {
  /* 文字色 */
  --vp-c-text-1: var(--text-color);
  --vp-c-text: var(--text-color);
  /* 激活色 */
  --vp-c-accent: var(--theme-color);
  /* 边框色 */
  --vp-c-divider: var(--border-color);
  --vp-c-brand: var(--border-color);
  /* 背景色 */
  --vp-c-bg: var(--bg-color);
  --vp-c-bg-mute: var(--bg-color);
  --vp-c-bg-soft: var(--bg-color);
  /* 链接色 */
  --link-color: var(--theme-color);
}
```

数据与依赖问题：

略，未处理
