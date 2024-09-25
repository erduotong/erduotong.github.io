# 测试库
import shutil
import subprocess
if __name__ == '__main__':
    shutil.copytree("test_vault", "test", dirs_exist_ok=True)
    subprocess.run(['python', './main.py', '--path', "./test"], check=True)
