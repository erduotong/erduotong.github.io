---
category:
- 卡片
date: '2024-12-22'
isOriginal: true
tags:
- github
- github/page
title: Github Pages配置自定义域失效
---
## 描述
众所周知，Github Page中可以自己绑定到自定义域上
![IMG-20241227 234727457-Github Pages配置自定义域失效.png](/image/IMG-20241227 234727457-Github Pages配置自定义域失效.png)
但是有时候，每次重新构建，这个域名都会失效
## 解决
原因是 `CNAME` 文件被覆盖掉导致的

设置完成后，我们可以看到，github自动帮我们把CNAME文件写了进去
![IMG-20241227 234727861-Github Pages配置自定义域失效.png](/image/IMG-20241227 234727861-Github Pages配置自定义域失效.png)

CNAME文件里面写的就是我们刚刚的域
![IMG-20241227 234727875-Github Pages配置自定义域失效.png](/image/IMG-20241227 234727875-Github Pages配置自定义域失效.png)

因此，我们在部署的时候，直接把这个CNAME文件写进去就行了。
比如Github Action，就可以这样写入
```yaml
 - name: Add CNAME
   run: echo 'blog.erduotong.com' > src/.vuepress/dist/CNAME
```