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
        idVideo VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        channel VARCHAR(255) NOT NULL,
        publish_date VARCHAR(255) NOT NULL,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0
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


def gerenciador_video(video):
    criar_tabela_videos()
    if verificacao_video_ja_consultado(video["idVideo"]):
        print(f"✅ O vídeo {video['idVideo']} já foi consultado anteriormente. As informações serão atualizadas.")
        atualizar_video(video)
    else:
        print(f"🔍 Consultando informações do vídeo {video['idVideo']}...")
        insert_video(video)


def insert_video(video):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (idVideo, title, channel, publish_date, views, likes, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    valores = (
        video["idVideo"],
        video["title"],
        video["channel"],
        video["publish_date"],
        video["views"],
        video["likes"],
        video["comments"], 
    )
    cursor.execute(sql, valores)
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Vídeo {video['idVideo']} inserido com sucesso.")
    
def atualizar_video(video):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    UPDATE videos
    SET views = %s, likes = %s, comments = %s
    WHERE idVideo = %s
    """
    valores = (
        video["views"],
        video["likes"],
        video["comments"],
        video["idVideo"]
    )
    cursor.execute(sql, valores)
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Informações do vídeo {video['idVideo']} atualizadas com sucesso.")
    
    
def verificacao_video_ja_consultado(idVideo):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    SELECT 1 FROM videos WHERE idVideo = %s
    """
    valor = (idVideo,)
    cursor.execute(sql, valor)
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return resultado is not None
    


def inserir_comentarios(lista_comentarios):
    criar_tabelas_comentarios()
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