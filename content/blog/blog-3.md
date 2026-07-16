---
title: "Astro 博客从零到部署：2025 完整指南"
description: "手把手教你用 Astro 5 + TypeScript + GitHub Pages 搭建一个极速个人博客，包含内容管理、RSS、SEO 和自动部署的完整流程。"
pubDate: 2025-07-01
tags: ["Astro", "博客", "教程", "GitHub Pages", "TypeScript"]
category: "教程"
series: "博客搭建系列"
permalink: "astro-blog-guide-2025"
---
> test only

## 为什么选 Astro？

在 2025 年，静态站点生成器（SSG）的选择已经非常多——Next.js、Hugo、11ty、Hexo……但 **Astro** 有几个独特的卖点：

1. **默认零 JS**：生成的页面不含 JavaScript，除非你显式需要
2. **岛屿架构（Islands Architecture）**：交互式组件按需加载
3. **多框架混用**：同一项目里可以同时用 React、Vue、Svelte 组件
4. **Content Collections**：内置的类型安全的内容管理系统
5. **构建极快**：底层基于 Vite，开发体验丝滑

> 如果你只是想写博客，不需要 CSR/SSR/ISR 这些复杂度，Astro 是最简单的选择。

---

## 环境准备

在开始之前，确保你的开发环境：

| 工具 | 版本要求 | 检查命令 |
|------|----------|----------|
| Node.js | ≥ 18.x | `node -v` |
| npm / pnpm | 最新 | `npm -v` |
| Git | ≥ 2.30 | `git --version` |
| VS Code | - | 推荐安装 *Astro* 官方插件 |

---

## 第一步：创建项目

```bash
# 使用 create astro 脚手架
pnpm create astro@latest my-blog

# 选择模板时的推荐选项：
# ✔ Template: blog
# ✔ TypeScript: Yes (strict)
# ✔ Install dependencies: Yes
# ✔ Git init: Yes
```

项目结构初始化后：

```
my-blog/
├── astro.config.ts        # Astro 配置
├── src/
│   ├── content/           # 内容目录 ← 你的文章在这里
│   │   ├── blog/          #   blog 集合
│   │   └── config.ts      #   内容 schema 定义
│   ├── pages/             # 路由页面
│   ├── layouts/           # 布局组件
│   └── components/        # UI 组件
├── public/                # 静态资源（图片、favicon 等）
└── package.json
```

---

## 第二步：定义内容 Schema


```typescript
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({
    base: './content/blog',
    pattern: '**/*.{md}',
  }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    pubDate:     z.coerce.date(),
    updateDate:  z.coerce.date().optional(),
    tags:        z.array(z.string()),
    category:    z.string(),
    series:      z.string().optional(),
    permalink:   z.string(),
  }),
})

export const collections = { blog }
```


### Schema 字段说明

- `title` / `description` — 标题和摘要，会出现在首页列表和 SEO meta 中
- `pubDate` — 发布日期，格式 `YYYY-MM-DD`
- `updateDate` — **可选**，最后更新日期，用于显示"本文最近更新于……"
- `tags` — 标签数组，用于分类和检索
- `category` — 单一分类，用于导航
- `series` — **可选**，系列名，用于系列文章的串联
- `permalink` — URL 别名，如 `"my-first-post"` → `/blog/my-first-post/`

---

## 第三步：编写你的第一篇文章

在 `content/blog/` 下创建 `hello-world.md`：

```markdown
---
title: "Hello, World!"
description: "这是我的第一篇 Astro 博客文章"
pubDate: 2025-07-01
tags: ["随笔"]
category: "生活"
permalink: "hello-world"
---

## 这是我的第一篇博客 🎉

**Astro** 让写博客变得非常简单。

这里可以写任何 Markdown 内容：

- 列表
- `代码`
- > 引用

```js
console.log('甚至可以嵌入代码块！')
```

```

---

## 第四步：配置 RSS Feed 🔔

安装 RSS 包：

```bash
pnpm add @astrojs/rss
```

在 `src/pages/rss.xml.ts` 中：

```typescript
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const posts = await getCollection('blog')
  return rss({
    title: '我的博客',
    description: '一个用 Astro 搭建的个人博客',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.data.permalink}/`,
    })),
  })
}
```

访问 `/rss.xml` 即可看到生成的 RSS。

> ⚠️ **注意**：需要在 `astro.config.ts` 中设置 `site: 'https://your-domain.com'`，否则 RSS 的链接会出错。

---

## 第五步：部署到 GitHub Pages 🚀

### 5.1 配置 `astro.config.ts`

```typescript
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/', // 如果仓库名是 <username>.github.io，用 '/'
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
})
```

### 5.2 添加 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
      - uses: actions/deploy-pages@v4
```

### 5.3 推送并等待

```bash
git add .
git commit -m "feat: setup astro blog with github actions"
git push origin main
```

去仓库的 **Settings → Pages**，确认 Source 是 **GitHub Actions**。首次部署大约需要 1-2 分钟。

---

## 常见问题排查

检查 `astro.config.ts` 中的 `base` 字段：

- `<username>.github.io` 这种用户仓库 → `base: '/'`
- `<username>.github.io/<repo>` 这种项目仓库 → `base: '/<repo>/'`

确保图片放在 `public/` 目录下，引用时使用绝对路径：

```markdown
✅ ![图片](/images/photo.jpg)
❌ ![图片](../images/photo.jpg)
```


Astro 默认使用 **Shiki** 高亮。如需自定义主题，在 `astro.config.ts` 中配置：

```typescript
markdown: {
  shikiConfig: {
    theme: 'github-dark',
    wrap: true
  }
}
```


---

## 🎯 接下来做什么？

- [x] 项目初始化 + Schema 定义
- [x] 第一篇文章
- [x] RSS 集成
- [x] GitHub Pages 部署
- [ ] 添加评论系统（Giscus / Waline）
- [ ] 添加站点地图（`@astrojs/sitemap`）
- [ ] 自定义 404 页面
- [ ] 添加暗色模式
- [ ] 配置自定义域名

---

## 小结

用 Astro 搭建博客的体验非常流畅。从零到上线，一个下午就能搞定。`Content Collections` 的类型安全让内容管理变得可靠，而岛屿架构保证了页面的极致性能。

如果你正在考虑搭建个人博客，2025 年的 **Astro** 是一个不会后悔的选择。

---

*有问题？欢迎在 [GitHub Issues](https://github.com/erduotong/erduotong.github.io/issues) 交流。*
