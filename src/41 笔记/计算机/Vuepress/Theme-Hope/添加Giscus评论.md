---
backlink: []
date: '2024-10-18'
isOriginal: true
outlink:
- /image/IMG-20241018 202838725-添加Giscus评论.png
- /image/IMG-20241018 203207422-添加Giscus评论.png
- /image/IMG-20241018 203332811-添加Giscus评论.png
tags:
- giscus
- vuepress/theme-hope
title: 添加Giscus评论
---
## 简介
[Giscus](https://giscus.app/zh-CN)是一个基于Github Discussions的评论系统，可以让用户登录github账号以评论。
在Vuepress Themehope主题中，已经提供了Giscus的支持，通过一些配置就可以方便的调用

---

## 配置
### 准备
1. 首先，准备一个公有仓库，并且开启`Dicussions`功能，用于存放评论
2. 安装[Giscus](https://github.com/apps/giscus)的Github App，使Giscus有访问仓库的权限
### 配置
1.  前往[Giscus的网站](https://giscus.app/zh-CN)，向下滑动找到 `配置`，并且选择一个合适的语言![IMG-20241018 202838725-添加Giscus评论.png](/image/IMG-20241018 202838725-添加Giscus评论.png)
2. 找到仓库，填入你刚刚的仓库
   例如，你的Github仓库地址是 `https://github.com/<your-id>/<name>`
   那么，就这样填写仓库这一栏: 
   `<your-id>/<name>`![IMG-20241018 203207422-添加Giscus评论.png](/image/IMG-20241018 203207422-添加Giscus评论.png)
   等待一段时间，若网站说明识别通过，那么就可以继续了。![IMG-20241018 203332811-添加Giscus评论.png](/image/IMG-20241018 203332811-添加Giscus评论.png)
3. 继续往下，找到Discussion分类，根据提示，选择一个你喜欢的分类
4. 找到 `启用Giscus`， 将其中的一些值复制出来备用
    -  `data-repo`
    -  `data-repo-id`
    -  `data-cateory`
    -  `data-cateory-id`
### 录入
好了，我们已经有足够的数据了，是时候把它塞给vuepress了
首先，找到你的hopeTheme配置文件中的plugins
   ```javascript
export default hopeTheme({
    plugins: {
    
    }
})
```

   然后，新建一个 `comment` 键，选择Giscus作为评论，并且填入刚刚的数据
```javascript
export default hopeTheme({
  plugins: {
    comment: {
      provider: "Giscus", // 要用的评论系统 因为是Giscus所以填Giscus
      repo: "erduotong/erduotong.github.io", // 刚刚data-repo里面的内容
      repoId: "...", // 刚刚data-repo-id里面的内容
      category: "Announcements", // 刚刚data-category里面的内容
      categoryId: "...", // 刚刚data-category-id里面的内容
    },
  },
});
```

重启服务，配置就完成了