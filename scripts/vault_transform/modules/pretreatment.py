# 预处理一些内容
import pathlib
import shutil


def pretreatment(target: pathlib.Path, remove_folder: list):
    """
    预处理一些内容
    :param target: 目标路径
    :param remove_folder: 要删除的文件夹
    :return:
    """
    for item in target.iterdir():
        if item.is_dir() and item.name in remove_folder:
            print("预处理: 删除文件夹", item)
            shutil.rmtree(item)
