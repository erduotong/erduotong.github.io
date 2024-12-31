---
category:
- 卡片
date: '2024-10-26'
isOriginal: true
tags:
- localStorage
- jsdom
- nodejs
title: jsdom导致无法使用localStorage
---
## 情况
在使用[Anyblock](Anyblock)插件的时候，通过源码安装时，出现`Storage is not defined`的报错
![IMG-20241227 234727458-jsdom导致无法使用localStorage.png](/image/IMG-20241227 234727458-jsdom导致无法使用localStorage.png)
## 解决
首先，既然你找不到Storage，那就写一个进去
```js
global.Storage = null
```
接下来，出现了新的报错![IMG-20241227 234727561-jsdom导致无法使用localStorage.png](/image/IMG-20241227 234727561-jsdom导致无法使用localStorage.png)
然后，构造一个函数，既然需要`instanceof`，那么就给它
```js
global.Storage = function(){
    this.temp_method = function() {}
}
```
这样，它就拥有了一个构造函数，里面也有方法可供访问。
这样，就成功欺骗了想要 `Storage` 的某些函数，在nodejs环境下正常运行