---
category:
- 卡片
date: '2024-12-01'
isOriginal: true
tags:
- Tauri
- rust
- 日志
- debug
- Tracing
title: Tauri和Tracing一起使用时无法写入到文件
---
## 描述
在[Tauri](./Tauri.md)和[tracing](https://docs.rs/tracing/latest/tracing/)一起使用的时候，如果在Tauri中使用命令，从前端调用后端记录日志，控制台有输出，但是无法写入到文件中，文件中只有在其他地方调用的日志
## 解决办法
换用其他的日志库 `flexi_logger是可用的，一切正常`
## 猜想
Tracing的实现逻辑和其他日志库不一样，导致Tauri的异步调用无法记录进去。