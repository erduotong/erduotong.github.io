---
category:
- 卡片
date: '2024-12-08'
isOriginal: true
tags: []
title: Proxifier转发到Fiddler
---
## 前言
Fiddler可以对网络进行抓包，但是一些程序没办法被Fiddler直接抓到。为此，我们就需要[Proxifier](./Proxifier.md)来代理，将所有都转发给Fiddler
## 操作流程
1. 打开软件，选择配置文件 --> 高级 --> HTTP代理服务器 --> 启用HTTP代理服务器支持
   ![IMG-20241208 192602069-Proxifier转发到Fiddler.png](/image/IMG-20241208 192602069-Proxifier转发到Fiddler.png)
   ![IMG-20241208 192633641-Proxifier转发到Fiddler.png](/image/IMG-20241208 192633641-Proxifier转发到Fiddler.png)
2. 设置代理服务器和Fiddler的代理设置相匹配(这里只考虑默认情况)
    1. 首先，打开配置文件-->代理服务器-->添加，设置为`127.0.0.1:8888`，协议选择`Https`，然后点击确定
       ![IMG-20241208 194918795-Proxifier转发到Fiddler.png](/image/IMG-20241208 194918795-Proxifier转发到Fiddler.png)
       ![IMG-20241208 194853838-Proxifier转发到Fiddler.png](/image/IMG-20241208 194853838-Proxifier转发到Fiddler.png)
    2. 设置代理规则，一般来说会自动创建 `Fiddler.exe [auto-created`，如果没有就稍作等待![IMG-20241208 195116327-Proxifier转发到Fiddler.png](/image/IMG-20241208 195116327-Proxifier转发到Fiddler.png)
       ![IMG-20241208 195130110-Proxifier转发到Fiddler.png](/image/IMG-20241208 195130110-Proxifier转发到Fiddler.png)
3. 打开Fiddler->Tools->Options->HTTPS，然后全勾选即可
   ![Pasted image 20241208195245.png](/image/Pasted image 20241208195245.png)
5. 选择Options->Connections，配置Fiddler的port，要和上方保持一致(例如8888)
   ![Pasted image 20241208195341.png](/image/Pasted image 20241208195341.png)
6. 设置完成，接下来就可以在Fiddler愉快的抓包了
## 参考链接
[FIddler+Proxifer 实现PC客户端抓包 - Bypass - 博客园](https://www.cnblogs.com/xiaozi/p/11684221.html)