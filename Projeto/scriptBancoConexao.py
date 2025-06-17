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
        idVideo VARCHAR(255) NOT NULL PRIMARY KEY,
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


def insert_info(video):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (idVideo, title, channel, publish_date, views, likes, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        video["idVideo"],
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
    print(f"✅ Vídeo {video['idVideo']} inserido com sucesso.")
    
    
def insert_comments(comments):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    INSERT INTO comentarios (idVideo, author, text, likes, published_at, felling)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            aux["idVideo"],
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
    print(f"✅ {len(comments)} comentários inseridos com sucesso.")
    
    
def atualizar_info_video(video):
    conn = conectar()
    cursor = conn.cursor()
    sql = """
    UPDATE videos
    SET views = %s, likes = %s, comments = %s
    WHERE idVideo = %s
    """
    values = (
        video["views"],
        video["likes"],
        video["comments"],
        video["idVideo"]
    )
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Informações do vídeo {video['idVideo']} atualizadas com sucesso.")  
     
    
def atualizar_comentario_video(idVideo, novos_comentarios):
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
        ultima_data_banco = datetime.strptime(resultado[0], "%Y-%m-%dT%H:%M:%SZ")
    else:
        ultima_data_banco = None

    comentarios_para_inserir = []

    for c in novos_comentarios:
        data_nova = datetime.strptime(c["published_at"], "%Y-%m-%dT%H:%M:%SZ")
        if ultima_data_banco is None or data_nova > ultima_data_banco:
            comentarios_para_inserir.append((
                c["idVideo"],
                c["author"],
                c["text"],
                c["likes"],
                c["published_at"],
                c["felling"]
            ))

    if comentarios_para_inserir:
        sql = """
        INSERT INTO comentarios (idVideo, author, text, likes, published_at, felling)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, comentarios_para_inserir)
        conn.commit()
        print(f"✅ {len(comentarios_para_inserir)} novos comentários inseridos.")
    else:
        print("📭 Nenhum novo comentário para inserir.")

    cursor.close()
    conn.close()
    
 
def verificacao_video_consultado(idVideo):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 1 FROM videos WHERE idVideo = %s
    """, (idVideo,))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return resultado is not None
 
        
def gerenciador_video(video, comments):
    criar_tabela_videos()
    criar_tabelas_comentarios()
    
    if verificacao_video_consultado(video["idVideo"]):
        print(f"✅ O vídeo {video['idVideo']} já foi consultado anteriormente. As informações serão atualizadas.")
        atualizar_info_video(video)
        atualizar_comentario_video(video["idVideo"], comments)
    else:
        print(f"🔍 Consultando informações do vídeo {video['idVideo']}...")
        insert_info(video)
        insert_comments(comments)