import mysql.connector
from datetime import datetime
from tkinter import messagebox


def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345",
        database="projetopython"
    )


def criar_tabela_videos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        idVideo INT AUTO_INCREMENT PRIMARY KEY,
        codeURL VARCHAR(11) NOT NULL,
        idUsuario INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        channel VARCHAR(255) NOT NULL,
        publish_date VARCHAR(255) NOT NULL,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def criar_tabelas_comentarios():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comentarios (
        idComentario INT AUTO_INCREMENT PRIMARY KEY,
        idVideo INT NOT NULL,
        author VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        likes INT DEFAULT 0,
        published_at VARCHAR(255) NOT NULL,
        felling VARCHAR(255) NOT NULL,
        FOREIGN KEY (idVideo) REFERENCES videos(idVideo)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def criarTabelaUsuarios():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def criarTabelas():
    criarTabelaUsuarios()
    criar_tabela_videos()
    criar_tabelas_comentarios()


def insert_info(video_info, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (codeURL, idUsuario, title, channel, publish_date, views, likes, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        video_info["codeURL"],
        idUsuario,
        video_info["title"],
        video_info["channel"],
        video_info["publish_date"],
        video_info["views"],
        video_info["likes"],
        video_info["comments"],
    )
    cursor.execute(sql, values)
    conn.commit()
    print(
        f"✅ Informações do vídeo '{video_info['title']}' inseridas com sucesso.")
    cursor.close()
    conn.close()


def insert_comments(comments, idVideo):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO comentarios (idVideo, author, text, likes, published_at, felling)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            idVideo,
            aux["author"],
            aux["text"],
            aux["likes"],
            aux["published_at"],
            aux["felling"]
        )
        for aux in comments
    ]
    cursor.executemany(sql, values)
    conn.commit()
    print(f"✅ {len(values)} comentários inseridos para o vídeo ID {idVideo}.")
    cursor.close()
    conn.close()


def atualizar_info_video(video_info, idVideo):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    UPDATE videos
    SET views = %s, likes = %s, comments = %s
    WHERE idVideo = %s
    """
    values = (
        video_info["views"],
        video_info["likes"],
        video_info["comments"],
        idVideo
    )
    cursor.execute(sql, values)
    conn.commit()
    print(f"✅ Informações do vídeo ID {idVideo} atualizadas com sucesso.")
    cursor.close()
    conn.close()


def atualizar_comentario_video(comments, idVideo):
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT published_at FROM comentarios
        WHERE idVideo = %s
        ORDER BY published_at DESC
        LIMIT 1
    """, (idVideo,))

    resultado = cursor.fetchone()

    if resultado:
        ultima_data_banco = datetime.strptime(
            resultado[0], "%Y-%m-%dT%H:%M:%SZ")
    else:
        ultima_data_banco = None

    new_comments = []

    for c in comments:
        data_nova = datetime.strptime(c["published_at"], "%Y-%m-%dT%H:%M:%SZ")
        if ultima_data_banco is None or data_nova > ultima_data_banco:
            new_comments.append((
                idVideo,
                c["author"],
                c["text"],
                c["likes"],
                c["published_at"],
                c["felling"]
            ))

    if new_comments:
        sql = """
        INSERT INTO comentarios (idVideo, author, text, likes, published_at, felling)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, new_comments)
        conn.commit()
    print(
        f"✅ {len(new_comments)} novos comentários inseridos para o vídeo ID {idVideo}.")
    cursor.close()
    conn.close()


def verificacao_video_consultado(codeURL, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idVideo FROM videos WHERE codeURL = %s AND idUsuario = %s
    """, (codeURL, idUsuario))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    return resultado[0] if resultado else None


def gerenciador_video(video_info, comments, idUsuario):
    criarTabelas()
    idVideo = verificacao_video_consultado(video_info["codeURL"], idUsuario)
    if idVideo:
        atualizar_info_video(video_info, idVideo)
        atualizar_comentario_video(comments, idVideo)

    else:
        insert_info(video_info, idUsuario)
        idVideo = verificacao_video_consultado(
            video_info["codeURL"], idUsuario)
        insert_comments(comments, idVideo)


def cadastrarUsuario(usuario, senha):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
            SELECT idUsuario FROM usuarios WHERE usuario = %s
        """, (usuario,))
    resultado = cursor.fetchone()
    if resultado:
        print(f"❌ O usuário '{usuario}' já existe.")
        return False
    cursor.execute("""
        INSERT INTO usuarios (usuario, senha)
        VALUES (%s, %s)
    """, (usuario, senha))
    conn.commit()
    print(f"✅ Usuário '{usuario}' cadastrado com sucesso.")
    cursor.close()
    conn.close()
    return True


def autenticarUser(usuario, senha):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idUsuario FROM usuarios WHERE usuario = %s AND senha = %s
    """, (usuario, senha))
    resultado = cursor.fetchone()
    if resultado:
        print(f"✅ Usuário '{usuario}' autenticado com sucesso.")
    else:
        print("❌ Falha na autenticação. Usuário ou senha incorretos.")
    cursor.close()
    conn.close()

    return resultado[0] if resultado else None
