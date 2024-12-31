---
category:
- 卡片
date: '2024-11-16'
isOriginal: true
tags:
- Git
- github
- ssh
- watt_toolkit
title: git使用ssh的同时使用watt toolkit加速github
---
## 问题由来
在使用ssh的方式拉取Git仓库的时候，如果使用watt tookit，通过host加速Github的链接的话，因为修改Host为如下这样:
```
127.0.0.1 github.com
```
所以会导致ssh推送失败，二者只能取其一。
## 分析
既然这两者冲突，那么我们需要解决其中的一个问题。
先考虑解决Github的加速问题，尝试过[VPN](VPN)，但是因为不稳定遂放弃。
因此，尝试使ssh能在开加速的情况下能推送到Github
## 解决方案
因为Github更新了 `RSA SSH Private Key` 
> Github自己把这个东西泄露出去了...，所以更新了
> 见这边:[Github Blog - We updated our RSA SSH host key](https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/)

所以，我们需要替换 `~/.ssh/known_hosts` 中老旧的信息。

1. 首先，让我们移除老旧的信息，让老旧的信息放到old文件里面去
```
ssh-keygen -R github.com
```
2. 接着，打开文件`~/.ssh/known_hosts`，把最新的key添加进去
```
github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
```

大功告成，现在啥都正常啦！Push/Clone操作都很完美

--- 
## 参考链接
- [如何解决 Github 3月24日 更新 RSA SSH host key 之后无法克隆项目最近在使用 SSH 克隆 G - 掘金](https://juejin.cn/post/7214512376670158885)
- [Github Blog - We updated our RSA SSH host key](https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/)