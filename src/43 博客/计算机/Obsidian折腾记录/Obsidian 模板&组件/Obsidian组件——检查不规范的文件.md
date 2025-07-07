---
category: []
date: 2024-10-19
isOriginal: true
tags:
- Obsidian
- Dataviewjs
title: Obsidian组件——检查不规范的文件
---
## 背景
众所周知，Obsidian是一款依赖于 `Markdown` 笔记软件。但是因为Obsidian既支持Wiki链接 (形如`[]()`)，又支持Markdown链接（形如`[]()`），在某些时候，就会出现一些文件名，与markdown链接冲突，或者与Wiki链接冲突。
为了解决这个问题，就有了这个组件。
## 功能
- 列出所有存在问题的文件
- 文件名预览
- 一键跳转到目标文件
- 提出修改的命名建议
- 一键修改成符合规范的命名
![IMG-20250614 162936690-Obsidian组件——检查不规范的文件.png](/image/IMG-20250614 162936690-Obsidian组件——检查不规范的文件.png)
## 使用
1. 首先，下载**Dataview**插件
2. 将下列代码粘贴到任意一个笔记文件中
3. 开始使用吧！

> [!note] 匹配更多字符
> 你可以修改 `unallowedChars` 这个对象，并且添加一个新的键，以及一个你想要替换的值。
> 例如，你想要将空格替换为_，那么你应该这样添加一个新的项:
> ```js
>const unallowedChars = {
>    " ": "_"
>}
> ```


````markdown
```dataviewjs
const unallowedChars = {
  "#": "＃",
  "^": "＾",
  "[": "［",
  "]": "］",
  "(": "（",
  ")": "）",
  "|": "｜",
};
async function viewIncorrectFiles() {
  const files = app.vault.getFiles().filter((file) => {
    return Object.keys(unallowedChars).some((char) => file.name.includes(char));
  });
  // 获取所有文件名不符合规范的文件
  if (files.length === 0) {
    dv.paragraph("✅ 恭喜，所有的文件名都符合规范！");
  }
  else {
    dv.paragraph("🚨 以下文件名不符合规范，请检查");
  }
  dv.table(
    ["文件名", "查看文件", "重命名文件", "重命名预览"],
    files.map((file) => {
      const show = dv.el("button", "查看文件");
      show.onclick = () => {
        app.workspace
          .createLeafInTabGroup(app.workspace.rootSplit.children[0])
          .openFile(file, { active: true });
      };
      const rename = dv.el("button", "重命名");
      let replaced_name = file.name;
      for (const [key, value] of Object.entries(unallowedChars)) {
        replaced_name = replaced_name.split(key).join(value);
      }
      rename.onclick = () => {
        app.fileManager.renameFile(
          file,
          `${file.parent.path}/${replaced_name}`
        );
      };
      return [file.name, show, rename, replaced_name];
    })
  );
}
await viewIncorrectFiles();

```
````