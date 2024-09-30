# 格式化markdown文档中的yaml
import yaml


def extract_yaml_content(file: str) -> tuple:
    lines = file.splitlines()

    if not lines or lines[0].strip() != '---':
        return '', file  # 如果第一行不是 '---'，返回空的 YAML 内容和原始内容

    yaml_content = []
    content = []
    in_yaml_block = False
    yaml_matched = False

    for line in lines:
        stripped_line = line.strip()
        if stripped_line == '---':
            if in_yaml_block:
                in_yaml_block = False
                yaml_matched = True
                continue  # Skip the closing '---'
            else:
                if yaml_matched:
                    content.append(line)
                    continue
                in_yaml_block = True
                continue  # Skip the starting '---'

        if in_yaml_block:
            yaml_content.append(line)
        else:
            content.append(line)

    yaml_str = '\n'.join(yaml_content)
    content_str = '\n'.join(content)
    # format yaml to dict
    yaml_content = yaml.load(yaml_str, Loader=yaml.FullLoader)
    return yaml_content, content_str


def test_extract_yaml_content():
    file = """---   
date: 2024-02-25
share: false
tags:
  - project
---
初中历史关系图
## 信息
- 起始时间: 2024-02-25
- 结束时间: 
- 状态: #tracking 
## 简介
这是对整个初中历史(2022级)的每课的笔记，包括关系梳理，时间轴等
## 待办

## 记录
- 2024-02-25 项目建立"""
    yaml_str, content_str = extract_yaml_content(file)
    print(content_str)
    print(yaml_str)


test_extract_yaml_content()
