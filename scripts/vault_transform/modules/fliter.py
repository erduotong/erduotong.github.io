# 过滤所需的文件
import os
from pathlib import Path

from modules.link_handle import files_dict
from modules.yaml_fomatter import extract_yaml_content

share_list = []
other_list = []


def filter_files(dirname: Path) -> None:
    """
    过滤所需的文件
    project.md的share属性可以指定当前路径下所有的文件的可访问性，除非文件自身强制要求可以被分享，或者子项目覆盖。
    然后，遍历所有share=true的文件
    接着，删除所有不在share列表中的md
    最后，删除所有没被任何一个引用的文件

    :return:
    """

    def deepen_folders(folder: Path, is_share: bool):
        # 判断project.md是否存在？
        for file in folder.iterdir():
            if file.is_file():
                if file.name == 'project.md':
                    with open(file, 'r', encoding='utf-8') as f:
                        yaml_content, _ = extract_yaml_content(f.read());
                        if yaml_content and 'share' in yaml_content:
                            is_share = yaml_content['share']
        # 遍历该文件夹下的所有文件
        for file in folder.iterdir():
            if file.is_file() and file.suffix == '.md':
                with open(file, 'r', encoding='utf-8') as f:
                    yaml_content, _ = extract_yaml_content(f.read())

                    if yaml_content and 'share' in yaml_content and yaml_content['share']:
                        share_list.append(file)
                    elif is_share:
                        share_list.append(file)
        # 遍历该文件夹下的所有文件夹
        for sub_folder in folder.iterdir():
            if sub_folder.is_dir():
                deepen_folders(sub_folder, is_share)

    deepen_folders(dirname, False)
    for file in dirname.rglob('*.md'):
        if file not in share_list:
            file.unlink()
            print(f"Deleted file: {file}")
        else:
            # 从files_dict中找出剩下被引用的文件保留
            # 从files_dict中找出当前文件
            current_file = None
            for key, value in files_dict.items():
                if value.path == file:
                    current_file = value

                    break
            # 遍历current_file的link_to，并且找到link_to的文件，将其加入other_list
            for link in current_file.link_to:
                # 通过os计算出link_to相对于dirname的路径
                temp_link = os.path.join(current_file.path.parent, link)
                temp_link = os.path.normpath(temp_link)
                temp_link = Path(temp_link)

                for key, value in files_dict.items():
                    if temp_link == value.path:
                        other_list.append(value.path)
                        break
    # 最后删除other_list内不包含的文件，并且不删除额外的md
    for file in dirname.rglob('*'):
        if file.is_file() and file.suffix != '.md' and file not in other_list:
            file.unlink()
            print(f"Deleted file: {file}")
    # 处理files_dict中的每一项
    to_delete = []
    for key, value in files_dict.items():
        # 判断文件是否还存在，不存在则删除
        if not value.path.exists():
            to_delete.append(key)
            continue
        # 检查link_to和backlink_to的每一项文件是否还存在，不存在则删除
        for link in value.link_to:
            temp_link = os.path.join(value.path.parent, link)
            temp_link = os.path.normpath(temp_link)
            temp_link = Path(temp_link)
            if not temp_link.exists():
                value.link_to.remove(link)
        for backlink in value.backlink:
            temp_link = os.path.join(value.path.parent, backlink)
            temp_link = os.path.normpath(temp_link)
            temp_link = Path(temp_link)
            if not temp_link.exists():
                value.backlink.remove(backlink)
    for key in to_delete:
        del files_dict[key]

    print("Finished! ")
    for key, value in files_dict.items():
        print(str(value))
