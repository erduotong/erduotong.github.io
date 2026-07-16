---
title: "2025 前端技术趋势：Rust 工具链的崛起"
description: "从 SWC 到 Turbopack，Rust 正在重塑前端构建工具链。本文梳理 2025 年值得关注的技术趋势与工具选型建议。"
pubDate: 2025-03-15
updateDate: 2025-06-01
tags: ["前端", "Rust", "构建工具", "2025 趋势"]
category: "技术"
series: "2025 技术趋势"
slug: javascript-rust-2025
---
> test only

## 引言

过去几年，前端构建工具经历了从 JavaScript 到 **Rust** / **Go** 原生语言的范式转移。2025 年，这一趋势不仅没有放缓，反而正在成为新项目的默认选择。

> "Any application that can be written in JavaScript, will eventually be written in JavaScript."
> — Atwood's Law 的 2025 版本可能是：*"Any tool that can be rewritten in Rust, will eventually be rewritten in Rust."*

---

## 生态全景

截至 2025 年中，Rust 在前端工具链的渗透情况：

| 工具 | 领域 | 状态 | 备注 |
|------|------|------|------|
| **SWC** | 编译/转译 | ✅ 成熟 | Next.js 默认编译器 |
| **Turbopack** | 打包 | ⚡ Beta | Webpack 继任者 |
| **Rspack** | 打包 | ✅ 稳定 | Webpack API 兼容 |
| **Lightning CSS** | CSS 处理 | ✅ 成熟 | Parcel 团队出品 |
| **Oxc** | Linting | 🚧 开发中 | 目标替代 ESLint |
| **Rolldown** | 打包 | 🚧 开发中 | Vite 团队，基于 Oxc |

---

## 为什么是 Rust？

### 1. 性能优势

一个简单的 benchmark 对比：

```rust
// Rust 版本 — SWC 核心解析逻辑（简化示意）
use swc_common::SourceMap;
use swc_ecma_parser::{Parser, StringInput, Syntax};

fn parse_module(src: &str) -> Result<Module, Error> {
    let fm = SourceMap::default().new_source_file(
        FileName::Anon,
        src.into(),
    );
    let mut parser = Parser::new(
        Syntax::Es(Default::default()),
        StringInput::from(&*fm),
        None,
    );
    parser.parse_module()
}
```

同样的任务在 JavaScript 中：

```javascript
// JavaScript 版本 — Babel 解析
import { parse } from '@babel/parser';

function parseModule(src) {
  return parse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });
}
```

在 **10,000 个文件的 monorepo** 中，SWC 比 Babel 快约 ~~20 倍~~ **17~25 倍**（因项目而异）。

### 2. 类型安全 + 零成本抽象

Rust 的所有权系统在编译期消除内存 bug。没有 `undefined is not a function` 的运行时恐慌。

```rust
// 零成本抽象示例
#[derive(Debug)]
struct AstNode {
    kind: NodeKind,
    span: Span,
}

fn transform(node: &AstNode) -> TransformedNode {
    // 编译器保证：没有 null，没有意外 mutation
    todo!()
}
```

### 3. WASM 分发

通过 `wasm-pack`，Rust 工具可以发布到 npm：

```bash
# 构建 WASM 包
wasm-pack build --target bundler

# 发布到 npm
wasm-pack publish
```

---

## 实际迁移路径

如果你的团队正在考虑迁移，推荐的渐进式路径：

- [x] **第一步**：用 SWC 替换 Babel（~1 天，零配置）
- [x] **第二步**：用 Lightning CSS 替换 PostCSS / Autoprefixer
- [ ] **第三步**：评估 Rspack vs Turbopack 作为打包器
- [ ] **第四步**：引入 Oxc 作为 lint 加速层
- [ ] **第五步**：探索 Rolldown 用于新项目

### 踩坑记录

1. **SWC 插件生态**不如 Babel 丰富，自定义插件可能需要用 Rust 编写
2. **Turbopack** 对部分 webpack loader 兼容性有限
3. **Rspack** 的 webpack 兼容性在 95% 以上，但仍需测试
4. ~~Rolldown 还不能用于生产~~ *（2025-06 更新：0.3 版本已可用于小项目）*

---

## 小结

Rust 在前端工具链中的角色已经从「尝鲜选项」变为「生产标配」。对于新项目，**Rspack + SWC + Lightning CSS** 是一个成熟的起点。对于现有项目，可以从 SWC 替换 Babel 开始，逐步迁移。

*本文首发于 erduotong.github.io，转载请保留出处。*

---

## 参考资料

- [SWC 官方文档](https://swc.rs/)
- [Rspack —— 用 Rust 写的 Web Bundler](https://rspack.dev/)
- [Oxc: The JavaScript Oxidation Compiler](https://oxc.rs/)
- [Rolldown —— Vite 团队的 Rust Bundler](https://rolldown.rs/)
