from script_front import open_login_window
from script_banco_de_dados import create_all_tables
from script_ia_teste import treinar_modelos


treinar_modelos()
create_all_tables()
open_login_window()
