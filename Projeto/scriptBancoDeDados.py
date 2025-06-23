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
    idVideo VARCHAR(255) NOT NULL,
    idUsuario INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    publish_date VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    PRIMARY KEY (idUsuario, idVideo),
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
        idVideo VARCHAR(255) NOT NULL,
        idUsuario INT NOT NULL,
        author VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        likes INT DEFAULT 0,
        published_at VARCHAR(255) NOT NULL,
        felling VARCHAR(255) NOT NULL,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)  
        ON DELETE CASCADE ON UPDATE CASCADE,
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


def insert_info(video, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (idVideo, idUsuario, title, channel, publish_date, views, likes, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        video["idVideo"],
        idUsuario,
        video["title"],
        video["channel"],
        video["publish_date"],
        video["views"],
        video["likes"],
        video["comments"], 
    )
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    
    
def insert_comments(comments, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO comentarios (idVideo, idUsuario, author, text, likes, published_at, felling)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            aux["idVideo"],
            idUsuario,
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
    cursor.close()
    conn.close()
    
    
def atualizar_info_video(video, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    UPDATE videos
    SET views = %s, likes = %s, comments = %s
    WHERE idVideo = %s AND idUsuario = %s
    """
    values = (
        video["views"],
        video["likes"],
        video["comments"],
        video["idVideo"],
        idUsuario
    )
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
     
    
def atualizar_comentario_video(idVideo, novos_comentarios, idUsuario):
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT published_at FROM comentarios
        WHERE idVideo = %s AND idUsuario = %s
        ORDER BY published_at DESC
        LIMIT 1
    """, (idVideo, idUsuario))
    
    resultado = cursor.fetchone()

    if resultado:
        ultima_data_banco = datetime.strptime(resultado[0], "%Y-%m-%dT%H:%M:%SZ")
    else:
        ultima_data_banco = None

    comentarios_para_inserir = []

    for c in novos_comentarios:
        data_nova = datetime.strptime(c["published_at"], "%Y-%m-%dT%H:%M:%SZ")
        if ultima_data_banco is None or data_nova > ultima_data_banco:
            comentarios_para_inserir.append((
                c["idVideo"],
                idUsuario,
                c["author"],
                c["text"],
                c["likes"],
                c["published_at"],
                c["felling"]
            ))

    if comentarios_para_inserir:
        sql = """
        INSERT INTO comentarios (idVideo, idUsuario, author, text, likes, published_at, felling)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, comentarios_para_inserir)
        conn.commit()

    cursor.close()
    conn.close()
    
 
def verificacao_video_consultado(idVideo, idUsuario):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 1 FROM videos WHERE idVideo = %s AND idUsuario = %s
    """, (idVideo, idUsuario))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    return resultado is not None
 
        
def gerenciador_video(video, comments, idUsuario):
    criarTabelas()
    
    if verificacao_video_consultado(video["idVideo"], idUsuario):
        messagebox.showinfo("Informação", f"O vídeo '{video['title']}' já está cadastrado no banco de dados.")
        atualizar_info_video(video, idUsuario)
        atualizar_comentario_video(video["idVideo"], comments, idUsuario)

    else:
        print(f"📥 Cadastrando o vídeo '{video['title']}' no banco de dados.")
        insert_info(video, idUsuario)
        insert_comments(comments, idUsuario)
        
    
def cadastrarUsuario(usuario, senha):
    conn = conectar()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT INTO usuarios (usuario, senha)
        VALUES (%s, %s)
        """, (usuario, senha))
        conn.commit()
        return True
    except mysql.connector.IntegrityError:
        return False
    finally:
        cursor.close()
        conn.close()


def autenticarUser(usuario, senha):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idUsuario FROM usuarios WHERE usuario = %s AND senha = %s
    """, (usuario, senha))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return resultado[0] if resultado else None
