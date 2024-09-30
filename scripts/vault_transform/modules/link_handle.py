# 处理库中的wiki链接
import os
import pathlib
import re
import uuid


class File:
    def __init__(self,
                 path: pathlib.Path,
                 name: str,
                 file_type: str,
                 ):
        self.path = path
        self.name = name
        self.file_type = file_type

        self.link_to = []
        self.backlink = []


files_dict = {}


def to_relative_path(string):
    if not string.startswith('.'):
        return './' + string
    return string


def replace_links(file_path: pathlib.Path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 目标的字符串替换函数
    def replacer(match):
        target_name = match.group(1)

        # 分离文件名和显示名
        name_parts = target_name.split('|')
        if len(name_parts) == 1:
            file_name = name_parts[0]
            display_name = None
        else:
            file_name, display_name = name_parts[0], name_parts[1]

        # 分离文件名和标题
        title_parts = re.split(r'[#^]', file_name, 1)
        if len(title_parts) == 1:
            base_file_name, title = title_parts[0], ''
        else:
            base_file_name, title = title_parts[0], file_name[len(title_parts[0]):]
        if display_name is None:
            if base_file_name == '':
                display_name = re.sub(r'^[#^]+', '', title)
            else:
                display_name = base_file_name + title
        print(f"base_file_name: {base_file_name}, title: {title}, display_name: {display_name}")
        # 将该链接转换成与当前文件的相对路径，并且加上标题，并且给当前文件添加该目标的链接，以及目标的反向链接。
        # 链接和反向链接都保存相对路径
        # 检索当前文件在files_dict中的所属的File对象
        current_file = None
        for key, value in files_dict.items():

            if value.path == file_path:
                current_file = value
                break

        # 如果base_file_name是空字符串，或者是当前文件的名称，说明是当前文件的标题，直接返回
        if (base_file_name == '' or base_file_name == current_file.name
                or base_file_name == current_file.name + current_file.file_type):
            return f"[{display_name}]({title})"
        # 如果base_file_name是一个可以被找到的文件，那么就通过相对路径匹配这个文件
        is_found = False
        link_to_file = None
        # 先尝试匹配当前文件文件夹下的文件，匹配过后再尝试匹配整个库

        for key, value in files_dict.items():
            # 如果文件路径和当前文件路径位于同一个文件夹下才处理
            if value.path.parent == current_file.path.parent:
                if value.name == base_file_name or value.name + value.file_type == base_file_name:
                    link_to_file = value
                    is_found = True
                    break
        if not is_found:
            for key, value in files_dict.items():
                if value.name == base_file_name or value.name + value.file_type == base_file_name:
                    link_to_file = value
                    is_found = True
                    break
        if is_found:  # 处理找到的文件的相对路径
            current_file_path = current_file.path
            link_to_file_path = link_to_file.path
            # 通过os.path.relpath()函数获得当前文件到目标文件的相对路径
            relative_path = os.path.relpath(link_to_file_path, os.path.dirname(current_file_path))
            relative_path = to_relative_path(relative_path)
            current_file.link_to.append(relative_path)
            # 通过os.path.relpath()函数获得目标文件到当前文件的相对路径
            relative_path_back = os.path.relpath(current_file_path, os.path.dirname(link_to_file_path))
            relative_path_back = to_relative_path(relative_path_back)
            link_to_file.backlink.append(relative_path_back)

            return f"[{display_name}]({relative_path}{title})"

        # 找不到文件，那么就尝试理解为这是一个path
        # 尝试通过当前文件路径和base_file_name拼接成一个路径
        path = pathlib.Path(current_file.path.parent, base_file_name)
        normalized_path = os.path.normpath(path)

        print(normalized_path)
        is_found = False
        for key, value in files_dict.items():
            print(value.path, normalized_path + "." + value.file_type)
            if str(value.path) == normalized_path + "." + value.file_type or \
                    str(value.path) == normalized_path:
                link_to_file = value
                is_found = True
                break
        if not is_found:
            print(f"找不到文件：{path}")
            return f"[{display_name}]({target_name})"

        # 处理找到的文件的相对路径
        current_file_path = current_file.path
        link_to_file_path = link_to_file.path
        # 通过os.path.relpath()函数获得当前文件到目标文件的相对路径
        relative_path = os.path.relpath(link_to_file_path, os.path.dirname(current_file_path))
        relative_path = to_relative_path(relative_path)
        current_file.link_to.append(relative_path)
        # 通过os.path.relpath()函数获得目标文件到当前文件的相对路径
        relative_path_back = os.path.relpath(current_file_path, os.path.dirname(link_to_file_path))
        relative_path_back = to_relative_path(relative_path_back)
        link_to_file.backlink.append(relative_path_back)
        return f"[{display_name}]({relative_path}{title})"

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
            random_id = str(uuid.uuid4())
            files_dict[name + random_id] = file_obj
            print(f"文件名：{name}，文件类型：{file_type}，路径：{item}")
    # 第二次遍历 处理文件中的链接(只处理markdown文件中的)，并转换为关系字典
    for item in target.rglob('*'):
        if item.is_file() and item.suffix == '.md':
            replace_links(item)
            print(f"处理文件：{item}")
    # 输出所有文件的链接关系 并且要有缩进
    for key, value in files_dict.items():
        print(f"{key}:")
        print("  link_to:")
        for link in value.link_to:
            print(f"    - {link}")
        print("  backlink:")
        for link in value.backlink:
            print(f"    - {link}")
