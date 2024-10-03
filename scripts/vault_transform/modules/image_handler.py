"""
处理图片到公开文件夹，便于兼容vuepress的文件系统
遍历每个files_dict中的每个文件，如果是图片文件，就找其中backlinks中的每个文件
若目标文件是markdown文件，则修改所有指向这个图片的路径为/public/xxx.jpg
若重复，则加个hash值
"""
import os
import uuid
from pathlib import Path

from modules.link_handle import files_dict

image_type = ['jpg', 'jpeg', 'png', 'gif', 'svg']
move_target = 'public/image'
move_target_name = '/image'


def move_file(src, target):
    src_path = Path(src)
    target_path = Path(target)

    # Ensure the target directory exists
    target_path.parent.mkdir(parents=True, exist_ok=True)

    # Open the source file and read its content
    with src_path.open('rb') as src_file:
        content = src_file.read()

    # Open the target file and write the content
    with target_path.open('wb') as target_file:
        target_file.write(content)
    # Delete the source file
    src_path.unlink()


def update_link(dirname, file):
    # 遍历backlinks 找到所有指向这个图片的文件
    for backlink in file.backlink:

        path = os.path.normpath(os.path.join(file.path, '../', backlink))
        target_file = None
        for key, value in files_dict.items():
            if str(value.path) == path:  # 去TM的防御性编程
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
            if temp_path == str(file.path):
                original_img_path = link
                break
        # 找到了 判断一下是否
        move_target_path = os.path.normpath(os.path.join(move_target, file.name + '.' + file.file_type))
        while Path(move_target_path).exists():
            move_target_path = os.path.normpath(
                os.path.join(move_target, file.name + uuid.uuid4() + '.' + file.file_type))
        move_target_path = os.path.join(dirname, move_target_path)
        print(move_target_path, file.path)
        move_file(file.path, move_target_path)
        for i in range(len(target_file.link_to)):
            if target_file.link_to[i] == original_img_path:
                target_file.link_to[i] = f"{move_target_name}/{file.name}.{file.file_type}"




def image_handler(dirname):
    for key, value in files_dict.items():
        if value.file_type in image_type:
            update_link(dirname, value)
