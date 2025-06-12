import mysql.connector
from datetime import datetime

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
        title VARCHAR(255) NOT NULL,
        channel VARCHAR(255) NOT NULL,
        publish_date VARCHAR(255) NOT NULL,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        video_id VARCHAR(255) NOT NULL
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def criar_tabelas_comentarios():
    criar_tabela_videos()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comentarios (
        idComentario INT AUTO_INCREMENT PRIMARY KEY,
        idVideo INT NOT NULL,
        autor VARCHAR(255) NOT NULL,
        texto TEXT NOT NULL,
        likes INT DEFAULT 0,
        data_publicacao VARCHAR(255) NOT NULL,
        sentimento ENUM('POS', 'NEG', 'NEU') NOT NULL,
        FOREIGN KEY (idVideo) REFERENCES videos(idVideo)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def insertar_video(video):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (title, channel, publish_date, views, likes, comments, video_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    valores = (
        video["title"],
        video["channel"],
        video["publish_date"],
        video["views"],
        video["likes"],
        video["comments"],
        video["video_id"]
    )
    cursor.execute(sql, valores)
    conn.commit()
    cursor.close()
    conn.close()

def inserir_comentarios(lista_comentarios):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO comentarios (idVideo, autor, texto, likes, data_publicacao, sentimento)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    valores = [
        (
            c["idVideo"],
            c["autor"],
            c["texto"],
            c["likes"],
            c["data_publicacao"],
            c["sentimento"]
        )
        for c in lista_comentarios
    ]
    cursor.executemany(sql, valores)
    conn.commit()
    cursor.close()
    conn.close()
    

def pegar_id_video(video_id):
    conn = conectar()
    cursor = conn.cursor()
    sql = "SELECT idVideo FROM videos WHERE video_id = %s"
    cursor.execute(sql, (video_id,))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    if resultado:
        return resultado[0]
    else:
        return None