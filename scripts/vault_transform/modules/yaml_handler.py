# 处理
from pathlib import Path

import yaml
from dateutil import parser

from scripts.vault_transform.modules.yaml_fomatter import extract_yaml_content


def handler(file_content: str, file_title: str) -> str:
    yaml_content, content = extract_yaml_content(file_content)
    if isinstance(yaml_content, str):
        yaml_content = {}
    result_yaml = {
        "isOriginal": True,
    }
    if file_title != "project.md":
        result_yaml["title"] = file_title[:-3]
    if yaml_content.get("date") is not None:
        result_yaml["date"] = parser.parse(str(yaml_content["date"])).strftime("%Y-%m-%d")
    if yaml_content.get("tags") is not None:
        result_yaml["tags"] = yaml_content["tags"]

    yaml_content = yaml.dump(result_yaml, allow_unicode=True)
    return f"---\n{yaml_content}---\n{content}"


def yaml_handler(file_path: Path) -> None:
    for file in file_path.rglob("*.md"):
        with open(file, "r", encoding="utf-8") as f:
            file_content = f.read()
        new_content = handler(file_content, file.name)
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_content)
