# 处理库中的wiki链接
import os
import pathlib
import re


class File:
    def __init__(self,
                 path: pathlib.Path,
                 name: str,
                 file_type: str,
                 ):
        self.path = path
        self.name = name
        self.file_type = file_type


files_dict = {}


def replace_links(file_path: pathlib.Path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 目标的字符串替换函数
    def replacer(match):
        target_name = match.group(1)

        # 文件名+显示名分离
        parts = target_name.split('|')
        if len(parts) == 1:
            target_name = parts[0]
            target_display = None
        else:
            target_name, target_display = parts[0], parts[1]

        # 标题分离
        parts = target_name.split('#', 1)
        if len(parts) == 1:
            file_name, title = parts[0], ''
        else:
            file_name, title = parts[0], '#' + parts[1]
        # 尝试转换为相对路径

        if file_name in files_dict:  # 文件存在 计算相对路径
            current = file_path.parent
            to = files_dict[file_name].path
            file_name = os.path.relpath(to, current)
            if pathlib.Path(file_name).parent == pathlib.Path('.'):
                file_name = f'./{file_name}'

        if target_display is None:
            result = f'[{match.group(1)}]({file_name}{title})'
        else:
            return f'[{target_display}]({file_name}{title})'
        print(f"原始链接：{match.group(0)} 结果：{result}")
        return result

    # 处理代码块外的链接
    def replace_outside_code_blocks(text):
        code_block_pattern = re.compile(r'(```.*?```)', re.DOTALL)
        parts = code_block_pattern.split(text)
        for i in range(0, len(parts), 2):  # 选择代码块以外的部分
            parts[i] = re.sub(r'\[\[(.*?)]]', replacer, parts[i])
        return ''.join(parts)

    new_content = replace_outside_code_blocks(content)

    # 重新写回去
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)


def handle_link(target: pathlib.Path):
    # 第一次遍历，获得每个文件的索引
    for item in target.rglob('*'):
        if item.is_file():  # 如果是文件则转为File对象
            name, file_type = item.stem, item.suffix[1:]
            file_obj = File(path=item, name=name, file_type=file_type)
            files_dict[name] = file_obj
            print(f"文件名：{name}，文件类型：{file_type}，路径：{item}")
    # 第二次遍历 处理文件中的链接(只处理markdown文件中的)
    for item in target.rglob('*'):
        if item.is_file() and item.suffix == '.md':
            replace_links(item)
            print(f"处理文件：{item}")
