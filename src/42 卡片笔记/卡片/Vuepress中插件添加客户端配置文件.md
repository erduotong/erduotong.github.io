---
category:
- 卡片
date: '2024-12-08'
isOriginal: true
tags: []
title: Vuepress中插件添加客户端配置文件
---
## 背景
在Vuepress中，插件可能需要修改一些客户端中的内容，因此需要提供客户端文件
## 实现方法
在插件的返回字段中，添加一个`clientConfigFile`字段
```javascript
const plugin = () => {
    clientConfigFile: null
}
```
其中，clientConfigFile就是你的客户端配置文件。不过，需要指定一个路径。
```javascript
// 假设你的客户端配置文件和插件文件在同一目录
// plugin.js
// client.js
import {getDirname,path} from "vuepress/utils";

const __dirname =  getDirname(import.meta.url)
const plugin = () => {
    clientConfigFile: path.resolve(__dirname, "client.js"),
}
```
在client.js中，就自由的填写配置文件吧
## 要点
- `path` 和 `getDirname` 方法**一定要从** `vuepress/utils`中获得
- 如果从`fs`获得，就会导致路径解析出现问题
## 参考
[插件 API | VuePress](https://vuepress.vuejs.org/zh/reference/plugin-api.html#clientconfigfile)