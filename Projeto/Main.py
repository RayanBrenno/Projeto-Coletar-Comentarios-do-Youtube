import subprocess
import sys
import os

# Instala automaticamente todas as dependências do requirements.txt
def instalar_dependencias():
    caminho_reqs = os.path.join(os.path.dirname(__file__), "requirements.txt")
    if os.path.exists(caminho_reqs):
        print("📦 Instalando dependências do requirements.txt...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", caminho_reqs])
    else:
        print("❌ Arquivo requirements.txt não encontrado!")

# Instala e prossegue com o restante do código
instalar_dependencias()

# Aqui segue seu código principal
print("✅ Ambiente pronto para rodar o código!")
from script_front import open_login_window


open_login_window()
