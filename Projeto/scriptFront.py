import tkinter as tk
from tkinter import ttk
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


def login():
    login_window = tk.Tk()
    login_window.title("🔐 Login")
    centralizar_janela(login_window, 300, 250)
    login_window.configure(bg=cor_fundo)

    tk.Label(login_window, text="Usuário:", bg=cor_fundo,
             font=fonte_padrao).pack(pady=5)
    entrada_usuario = tk.Entry(login_window, font=fonte_padrao)
    entrada_usuario.pack()
    tk.Label(login_window, text="Senha:", bg=cor_fundo,
             font=fonte_padrao).pack(pady=5)
    entrada_senha = tk.Entry(login_window, show="*", font=fonte_padrao)
    entrada_senha.pack()

    def tentar_login():
        usuario = entrada_usuario.get()
        senha = entrada_senha.get()
        user_id = autenticarUser(usuario, senha)
        if user_id:
            login_window.destroy()
            abrir_tela_menu(user_id)
        else:
            messagebox.showerror("Erro", "Usuário ou senha inválidos.")

    frame_botoes = tk.Frame(login_window, bg=cor_fundo)
    frame_botoes.pack(pady=20)

    tk.Button(frame_botoes, text="Entrar", width=10, command=tentar_login, bg=cor_botoes,
              fg=cor_texto_botao, font=fonte_padrao).grid(row=0, column=0, padx=5)
    tk.Button(frame_botoes, text="Cadastrar", width=10, command=lambda: abrir_tela_cadastro(
        login_window), bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao).grid(row=0, column=1, padx=5)

    login_window.mainloop()


def abrir_tela_cadastro(janela_login):
    janela_login.destroy()

    cadastro_window = tk.Tk()
    cadastro_window.title("📝 Cadastro")
    centralizar_janela(cadastro_window, 300, 270)  # tamanho semelhante
    cadastro_window.configure(bg=cor_fundo)

    tk.Label(cadastro_window, text="Nome de usuário:",
             bg=cor_fundo, font=fonte_padrao).pack(pady=(10, 2))
    entrada_novo_usuario = tk.Entry(cadastro_window, font=fonte_padrao)
    entrada_novo_usuario.pack()
    tk.Label(cadastro_window, text="Senha:", bg=cor_fundo,
             font=fonte_padrao).pack(pady=(10, 2))
    entrada_nova_senha = tk.Entry(cadastro_window, show="*", font=fonte_padrao)
    entrada_nova_senha.pack()
    tk.Label(cadastro_window, text="Confirmar senha:",
             bg=cor_fundo, font=fonte_padrao).pack(pady=(10, 2))
    entrada_confirma = tk.Entry(cadastro_window, show="*", font=fonte_padrao)
    entrada_confirma.pack()

    def cadastrar():
        usuario = entrada_novo_usuario.get()
        senha = entrada_nova_senha.get()
        confirma = entrada_confirma.get()

        if not usuario or not senha or not confirma:
            messagebox.showwarning("Aviso", "Preencha todos os campos.")
        elif len(usuario) < 3:
            messagebox.showwarning(
                "Aviso", "O nome de usuário deve ter pelo menos 3 caracteres.")
        elif len(senha) < 8 or len(confirma) < 8:
            messagebox.showwarning(
                "Aviso", "A senha deve ter pelo menos 8 caracteres.")
        else:
            if senha != confirma:
                messagebox.showerror("Erro", "As senhas não coincidem.")
            else:
                sucesso = cadastrarUsuario(usuario, senha)
                if sucesso:
                    messagebox.showinfo(
                        "Sucesso", "Usuário cadastrado com sucesso!")
                    cadastro_window.destroy()
                    login()
                else:
                    messagebox.showerror("Erro", "Usuário já existe.")

    botoes_frame = tk.Frame(cadastro_window, bg=cor_fundo)
    botoes_frame.pack(pady=20)

    btn_cadastrar = tk.Button(botoes_frame, text="Cadastrar", width=12, command=cadastrar,
        bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)
    
    btn_voltar = tk.Button(botoes_frame, text="Voltar", width=12, command=lambda: [cadastro_window.destroy(), login()],
        bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)

    btn_cadastrar.grid(row=0, column=0, padx=5)
    btn_voltar.grid(row=0, column=1, padx=5)

    cadastro_window.mainloop()


def abrir_tela_menu(idUsuario):
    menu_window = tk.Tk()
    menu_window.title("📺 Menu de Ações")
    centralizar_janela(menu_window, 400, 220)
    menu_window.configure(bg=cor_fundo)

    tk.Label(menu_window, text="Escolha uma ação:",
             bg=cor_fundo, font=fonte_padrao).pack(pady=(20, 10))

    frame_botoes = tk.Frame(menu_window, bg=cor_fundo)
    frame_botoes.pack(pady=10)

    btn_consultar = tk.Button(frame_botoes, text="Consultar um novo vídeo", width=25, command=lambda: [menu_window.destroy(), abrir_tela_url(idUsuario)],
                              bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)
    btn_atualizar = tk.Button(frame_botoes, text="Atualizar vídeo", width=25, command=lambda: [menu_window.destroy(), abrir_tela_atualizar(idUsuario)],
                              bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)
    btn_voltar = tk.Button(frame_botoes, text="Voltar", width=25, command=lambda: [menu_window.destroy(), login()],
                           bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)

    btn_consultar.pack(pady=5)
    btn_atualizar.pack(pady=5)
    btn_voltar.pack(pady=5)

    menu_window.mainloop()


def abrir_tela_url(idUsuario):
    url_window = tk.Tk()
    url_window.title("🎥 Analisar Vídeo do YouTube")
    centralizar_janela(url_window, 500, 260)
    url_window.configure(bg=cor_fundo)

    tk.Label(url_window, text="Cole a URL do vídeo do YouTube:",
             bg=cor_fundo, font=fonte_padrao).pack(pady=(20, 10))

    frame_entry = tk.Frame(url_window, bg=cor_fundo)
    frame_entry.pack(padx=40)

    entrada_url = tk.Entry(frame_entry, width=50, font=fonte_padrao)
    entrada_url.pack()

    def consultar_video():
        codeUrl = get_codeURL(entrada_url.get())
        if codeUrl:
            url_window.destroy()
            abrir_tela_consulta(idUsuario, codeUrl)
        else:
            messagebox.showwarning(
                "Aviso", "Por favor, insira uma URL válida.")

    frame_botoes = tk.Frame(url_window, bg=cor_fundo)
    frame_botoes.pack(pady=(25, 10))

    btn_consultar = tk.Button(frame_botoes, text="Consultar", command=consultar_video,
                              width=12, bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)
    
    btn_voltar = tk.Button(frame_botoes, text="Voltar", command=lambda: [url_window.destroy(), abrir_tela_menu(idUsuario)],
                           width=12, bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)

    btn_consultar.grid(row=0, column=0, padx=5)
    btn_voltar.grid(row=0, column=1, padx=5)

    url_window.mainloop()


def abrir_tela_consulta(idUsuario, codeURL):
    info = get_video_info(codeURL)
    comments = get_all_comments(codeURL)
    gerenciador_video(info, comments, idUsuario)
    
    janela = tk.Tk()
    janela.title("📄 Informações do Vídeo")
    centralizar_janela(janela, 800, 600)
    janela.configure(bg=cor_fundo)

    lbl_titulo = tk.Label(janela, text=info["title"], font=("Segoe UI", 12, "bold"),
                          bg=cor_fundo, wraplength=760, justify="center")
    lbl_titulo.pack(pady=(15, 5))

    linha2 = tk.Frame(janela, bg=cor_fundo)
    linha2.pack(pady=5)
    tk.Label(linha2, text=f"Canal: {info['channel']}", bg=cor_fundo, font=fonte_padrao).pack(side="left", padx=10)
    tk.Label(linha2, text=f"Publicado em: {info['publish_date']}", bg=cor_fundo, font=fonte_padrao).pack(side="right", padx=10)

    linha3 = tk.Frame(janela, bg=cor_fundo)
    linha3.pack(pady=5)
    tk.Label(linha3, text=f"Views: {info['views']}", bg=cor_fundo, font=fonte_padrao).pack(side="left", padx=10)
    tk.Label(linha3, text=f"Likes: {info['likes']}", bg=cor_fundo, font=fonte_padrao).pack(side="left", padx=10)
    tk.Label(linha3, text=f"Comentários: {info['comments']} ({len(comments)})", bg=cor_fundo, font=fonte_padrao).pack(side="left", padx=10)

    frame_botao = tk.Frame(janela, bg=cor_fundo)
    frame_botao.pack(pady=(10, 5))
    btn_voltar_menu = tk.Button(frame_botao, text="Voltar para o menu",
                                command=lambda: [janela.destroy(), abrir_tela_menu(idUsuario)],
                                bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao)
    btn_voltar_menu.pack()
    
    frame_comentarios = tk.Frame(janela)
    frame_comentarios.pack(fill="both", expand=True, padx=10, pady=10)

    scrollbar_y = tk.Scrollbar(frame_comentarios)
    scrollbar_y.pack(side="right", fill="y")

    scrollbar_x = tk.Scrollbar(frame_comentarios, orient="horizontal")
    scrollbar_x.pack(side="bottom", fill="x")

    caixa_texto = tk.Text(frame_comentarios, wrap="word", font=("Segoe UI", 10),
                          yscrollcommand=scrollbar_y.set,
                          xscrollcommand=scrollbar_x.set)

    caixa_texto.pack(fill="both", expand=True)

    scrollbar_y.config(command=caixa_texto.yview)
    scrollbar_x.config(command=caixa_texto.xview)

    for comentario in comments:
        usuario = comentario.get("author", "anônimo")
        texto = comentario.get("text", "")
        likes = comentario.get("likes", 0)
        linha_formatada = f"{usuario} | {texto} | Likes -> {likes} \n\n"
        caixa_texto.insert("end", linha_formatada)

    caixa_texto.config(state="disabled") 
    

def abrir_tela_atualizar(idUsuario):
    videos = [
        {"video_id": "abc123", "title": "Como ganhar no x1", "channel": "CanalTop", "views": 1000, "likes": 200, "comments": 40},
        {"video_id": "def456", "title": "Gameplay insana", "channel": "GamerBR", "views": 3000, "likes": 500, "comments": 123},
        {"video_id": "ghi789", "title": "Melhores momentos 2024", "channel": "ReplayTV", "views": 12000, "likes": 1500, "comments": 400},
    ]

    janela = tk.Tk()
    janela.title("🔁 Atualizar Vídeo")
    centralizar_janela(janela, 600, 400)
    janela.configure(bg=cor_fundo)

    tk.Label(janela, text="Selecione um vídeo para atualizar:", font=fonte_padrao, bg=cor_fundo).pack(pady=15)

    selecionado = tk.StringVar(value="")

    frame_check = tk.Frame(janela, bg=cor_fundo)
    frame_check.pack(padx=20, fill="x")

    for video in videos:
        text = f"{video['title']} — {video['channel']}"
        tk.Radiobutton(frame_check, text=text, variable=selecionado, value=video['video_id'],
                       bg=cor_fundo, anchor="w", font=fonte_padrao).pack(fill="x", pady=2)


    def atualizar_video():
        messagebox.showinfo(f"📈 Atualização concluída{selecionado.get()}", f'texto{selecionado.get()}')

    frame_botoes = tk.Frame(janela, bg=cor_fundo)
    frame_botoes.pack(pady=25)

    btn_atualizar = tk.Button(frame_botoes, text="Atualizar Selecionado", command=atualizar_video,
                              bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao, width=25)
    btn_atualizar.pack(pady=5)
    btn_voltar = tk.Button(frame_botoes, text="Voltar para o menu", command=lambda: [janela.destroy(), abrir_tela_menu(idUsuario)],
                           bg=cor_botoes, fg=cor_texto_botao, font=fonte_padrao, width=25)
    btn_voltar.pack(pady=5)

    janela.mainloop()


login() 