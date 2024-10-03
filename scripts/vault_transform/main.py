# 这是用于处理库的链接的脚本
import argparse
import os
import pathlib
import sys
import time

from modules.fliter import filter_files
from modules.image_handler import image_handler
from modules.link_handle import handle_link
from modules.pretreatment import pretreatment
from modules.yaml_handler import yaml_handler


def main() -> int:
    # 获得path参数
    parser = argparse.ArgumentParser(description='处理库的链接的脚本')
    parser.add_argument('--path', type=str, required=True, help='输入路径')
    args = parser.parse_args()
    dirname = pathlib.Path(args.path)
    sttime = time.time()
    exclude_folder = [".obsidianPC", ".obsidianPhone", ".trash", ".obsidian", '.git']
    print(f"开始处理{dirname}中的库的链接")
    pretreatment(dirname, exclude_folder)
    print(f"转换wiki链接并创建全局关系字典")
    handle_link(dirname)
    print(f"过滤所需文件")
    filter_files(dirname)
    print(f"处理每个文件的yaml到vuepress格式")
    yaml_handler(dirname)
    print(f"删除所有的空文件夹")
    for root, dirs, files in os.walk(dirname, topdown=False):
        for _dir in dirs:
            dir_path = os.path.join(root, _dir)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)
                print(f"Deleted empty folder: {dir_path}")
    print("图片处理")
    image_handler(dirname)
    print("再跑一次yaml_handler")
    yaml_handler(dirname)
    print(f"处理完成")
    print(f"总耗时{time.time() - sttime:.2f}秒")
    return 0


if __name__ == '__main__':
    sys.exit(main())
