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



