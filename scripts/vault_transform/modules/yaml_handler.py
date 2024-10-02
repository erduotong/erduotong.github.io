# 处理
from pathlib import Path

import yaml
from dateutil import parser
import re
from modules.yaml_fomatter import extract_yaml_content
from modules.link_handle import files_dict


def handler(file_content: str, file_title: str, current_file) -> str:
    yaml_content, content = extract_yaml_content(file_content)
    if isinstance(yaml_content, str):
        yaml_content = {}
    result_yaml = {
        "isOriginal": True,
        "outlink": current_file.link_to,
        "backlink": current_file.backlink
    }

    if file_title != "project.md":
        result_yaml["title"] = file_title[:-3]
    if yaml_content.get("date") is not None:
        clean_date = re.sub(r'[^\d-]', '', str(yaml_content["date"]))
        result_yaml["date"] = parser.parse(clean_date).strftime("%Y-%m-%d")
    if yaml_content.get("tags") is not None:
        result_yaml["tags"] = yaml_content["tags"]
    
    yaml_content = yaml.dump(result_yaml, allow_unicode=True,indent=2,default_flow_style=False)
    return f"---\n{yaml_content}---\n{content}"


def yaml_handler(file_path: Path) -> None:
    for file in file_path.rglob("*.md"):
        with open(file, "r", encoding="utf-8") as f:
            file_content = f.read()
        current_file = None
        for key, value in files_dict.items():
            if value.path == file:
                current_file = value
                break
        new_content = handler(file_content, file.name, current_file=current_file)
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_content)
