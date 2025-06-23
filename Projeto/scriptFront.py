import tkinter as tk
from tkinter import messagebox
from scriptBancoDeDados import *
from scriptCollectVideoInfo import *


fonte_padrao = ("Times New Roman", 13)
cor_fundo = "#f2f2f2"
cor_botoes = "#4a90e2"
cor_texto_botao = "white"


def centralizar_janela(janela, largura, altura):
    tela_largura = janela.winfo_screenwidth()
    tela_altura = janela.winfo_screenheight()
    x = (tela_largura - largura) // 2
    y = (tela_altura - altura) // 2
    janela.geometry(f"{largura}x{altura}+{x}+{y}")


def abrir_tela_url(idUsuario):
    url_window = tk.Tk()
    url_window.title("🎥 Analisar Vídeo do YouTube")
    centralizar_janela(url_window, 400, 200)
    url_window.configure(bg=cor_fundo)

    tk.Label(url_window, text="Cole a URL do vídeo do YouTube:", bg=cor_fundo, font=fonte_padrao).pack(pady=10)
    entrada_url = tk.Entry(url_window, width=50, font=fonte_padrao)
    entrada_url.pack(pady=5)

    def analisar_video():
        video_id = get_video_id(entrada_url.get())
        if video_id:
            messagebox.showinfo("Sucesso", f"Coletando informações e comentários do video: {video_id}")
            info = get_video_info(video_id)
            comments = get_all_comments(video_id)
            gerenciador_video(info, comments, idUsuario)
        else:
            messagebox.showwarning("Aviso", "Por favor, insira uma URL válida.")

    tk.Button(url_window, text="Analisar", command=analisar_video, bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao).pack(pady=20)
    url_window.mainloop()


def abrir_tela_cadastro(janela_login):
    janela_login.destroy()

    cadastro_window = tk.Tk()
    cadastro_window.title("📝 Cadastro")
    centralizar_janela(cadastro_window, 300, 250)
    cadastro_window.configure(bg=cor_fundo)

    tk.Label(cadastro_window, text="Nome de usuário:", bg=cor_fundo, font=fonte_padrao).pack(pady=5)
    entrada_novo_usuario = tk.Entry(cadastro_window, font=fonte_padrao)
    entrada_novo_usuario.pack()

    tk.Label(cadastro_window, text="Senha:", bg=cor_fundo, font=fonte_padrao).pack(pady=5)
    entrada_nova_senha = tk.Entry(cadastro_window, show="*", font=fonte_padrao)
    entrada_nova_senha.pack()

    tk.Label(cadastro_window, text="Confirmar senha:", bg=cor_fundo, font=fonte_padrao).pack(pady=5)
    entrada_confirma = tk.Entry(cadastro_window, show="*", font=fonte_padrao)
    entrada_confirma.pack()

    def cadastrar():
        usuario = entrada_novo_usuario.get()
        senha = entrada_nova_senha.get()
        confirma = entrada_confirma.get()
        
        if len(usuario) < 3:
            messagebox.showwarning("Aviso", "O nome de usuário deve ter pelo menos 3 caracteres.")
        elif len(senha) < 8 or len(confirma) < 8:
            messagebox.showwarning("Aviso", "A senha deve ter pelo menos 8 caracteres.")
        else:     
            if not usuario or not senha or not confirma:
                messagebox.showwarning("Aviso", "Preencha todos os campos.")
            elif senha != confirma:
                messagebox.showerror("Erro", "As senhas não coincidem.")
            else:
                sucesso = cadastrarUsuario(usuario, senha)
                if sucesso:
                    messagebox.showinfo("Sucesso", "Usuário cadastrado com sucesso!")
                    cadastro_window.destroy()
                    login()
                else:
                    messagebox.showerror("Erro", "Usuário já existe.")

    tk.Button(cadastro_window, text="Cadastrar", command=cadastrar, bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao).pack(pady=15)
    cadastro_window.mainloop()


def login():
    login_window = tk.Tk()
    login_window.title("🔐 Login")
    centralizar_janela(login_window, 300, 250)
    login_window.configure(bg=cor_fundo)

    tk.Label(login_window, text="Usuário:", bg=cor_fundo, font=fonte_padrao).pack(pady=5)
    entrada_usuario = tk.Entry(login_window, font=fonte_padrao)
    entrada_usuario.pack()

    tk.Label(login_window, text="Senha:", bg=cor_fundo, font=fonte_padrao).pack(pady=5)
    entrada_senha = tk.Entry(login_window, show="*", font=fonte_padrao)
    entrada_senha.pack()

    def tentar_login():
        usuario = entrada_usuario.get()
        senha = entrada_senha.get()
        user_id = autenticarUser(usuario, senha)
        if user_id:
            login_window.destroy()
            abrir_tela_url(user_id)
        else:
            messagebox.showerror("Erro", "Usuário ou senha inválidos.")

    frame_botoes = tk.Frame(login_window, bg=cor_fundo)
    frame_botoes.pack(pady=20)

    tk.Button(frame_botoes, text="Entrar", width=10, command=tentar_login, bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao).grid(row=0, column=0, padx=5)
    tk.Button(frame_botoes, text="Cadastrar", width=10, command=lambda: abrir_tela_cadastro(login_window), bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao).grid(row=0, column=1, padx=5)

    login_window.mainloop()
    


login()
