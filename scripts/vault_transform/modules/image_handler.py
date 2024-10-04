"""
处理图片到公开文件夹，便于兼容vuepress的文件系统
遍历每个files_dict中的每个文件，如果是图片文件，就找其中backlinks中的每个文件
若目标文件是markdown文件，则修改所有指向这个图片的路径为/public/xxx.jpg
若重复，则加个hash值
"""
import os
import shutil
import uuid
from pathlib import Path

from modules.link_handle import files_dict

image_type = ['jpg', 'jpeg', 'png', 'gif', 'svg']
move_target = '.vuepress/public/image'
move_target_name = '/image'


def move_file(src, target):
    print("movefile", src, target)
    src_path = Path(src)
    target_path = Path(target)

    # Ensure the target directory exists
    target_path.parent.mkdir(parents=True, exist_ok=True)

    # Open the source file and read its content
    shutil.move(src_path, target_path)


import re


def replace_md_links(file_path, original_img_path, target_path):
    pattern = re.compile(r'\[([^\]]+)\]\((.+?)\)')
    new_content = []

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            new_line = pattern.sub(
                lambda m: f"[{m.group(1)}]({target_path})" if os.path.normpath(m.group(2).strip()) == os.path.normpath(
                    original_img_path) else m.group(0), line)
            new_content.append(new_line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_content)


def update_link(dirname, file):
    # 遍历backlinks 找到所有指向这个图片的文件
    for backlink in file.backlink:

        path = os.path.normpath(os.path.join(file.path, '../', backlink))
        target_file = None
        for key, value in files_dict.items():
            if os.path.normpath(str(value.path)) == os.path.normpath(path):  # 去TM的防御性编程
                target_file = value
                break
        if target_file is None:
            print(f"找不到文件：{path}")
            continue
        if target_file.file_type != 'md':
            continue
        # 找到target_file中指向path的路径
        original_img_path = None
        for link in target_file.link_to:
            temp_path = os.path.normpath(os.path.join(target_file.path, '../', link))
            if temp_path == os.path.normpath(str(file.path)):
                original_img_path = link
                break
        # 找到了 判断一下是否
        move_target_path = os.path.normpath(os.path.join(move_target, file.name + '.' + file.file_type))
        while Path(move_target_path).exists():
            move_target_path = os.path.normpath(
                os.path.join(move_target, file.name + uuid.uuid4() + '.' + file.file_type))
        move_target_path = os.path.normpath(str(dirname) + '/' + move_target_path)
        move_file(file.path, move_target_path)
        for i in range(len(target_file.link_to)):
            if os.path.normpath(target_file.link_to[i]) == os.path.normpath(original_img_path):
                target_file.link_to[i] = f"{move_target_name}/{file.name}.{file.file_type}"
        # replace
        replace_md_links(target_file.path, original_img_path, f"{move_target_name}/{file.name}.{file.file_type}")


def image_handler(dirname):
    for key, value in files_dict.items():
        if value.file_type in image_type:
            update_link(dirname, value)
