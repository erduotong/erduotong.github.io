# 处理库中的wiki链接
import pathlib


class File:
    def __init__(self,
                 path: pathlib.Path,
                 name: str,
                 file_type: str,
                 ):
        self.path = path
        self.name = name
        self.file_type = file_type


def handle_link(target: pathlib.Path):
    files_dict = {}
    for item in target.rglob('*'):
        if item.is_file():  # 如果是文件则转为File对象
            name, file_type = item.stem, item.suffix[1:]
            file_obj = File(path=item, name=name, file_type=file_type)
            files_dict[name] = file_obj
            print(f"文件名：{name}，文件类型：{file_type}，路径：{item}")
