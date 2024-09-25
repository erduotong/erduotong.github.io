# 这是用于处理库的链接的脚本
import argparse
import pathlib
import sys

from scripts.vault_transform.modules.link_handle import handle_link
from scripts.vault_transform.modules.pretreatment import pretreatment


def main() -> int:
    # 获得path参数
    parser = argparse.ArgumentParser(description='处理库的链接的脚本')
    parser.add_argument('--path', type=str, required=True, help='输入路径')
    args = parser.parse_args()
    dirname = pathlib.Path(args.path)

    exclude_folder = [".obsidianPC", ".obsidianPhone", ".trash", ".obsidian"]
    print(f"开始处理{dirname}中的库的链接")
    pretreatment(dirname, exclude_folder)
    print(f"转换wiki链接")
    handle_link(dirname)
    return 0


if __name__ == '__main__':
    sys.exit(main())
