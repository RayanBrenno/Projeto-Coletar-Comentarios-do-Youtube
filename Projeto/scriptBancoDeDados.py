import mysql.connector
from datetime import datetime


def connect():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345",
        database="projetopython"
    )


def create_users_table():
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE,
        password VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def create_videos_table():
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        video_id INT AUTO_INCREMENT PRIMARY KEY,
        code_url VARCHAR(11) NOT NULL,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        channel VARCHAR(255) NOT NULL,
        publish_date VARCHAR(255) NOT NULL,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def create_comments_table():
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        video_id INT NOT NULL,
        author VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        likes INT DEFAULT 0,
        published_at VARCHAR(255) NOT NULL,
        feeling VARCHAR(255) NOT NULL,
        FOREIGN KEY (video_id) REFERENCES videos(video_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


def create_all_tables():
    create_users_table()
    create_videos_table()
    create_comments_table()


def insert_video_info(video_info, user_id):
    conn = connect()
    cursor = conn.cursor()
    sql = """
    INSERT INTO videos (code_url, user_id, title, channel, publish_date, views, likes, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        video_info["codeURL"],
        user_id,
        video_info["title"],
        video_info["channel"],
        video_info["publish_date"],
        video_info["views"],
        video_info["likes"],
        video_info["comments"]
    )
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()


def insert_comments(comments, video_id):
    conn = connect()
    cursor = conn.cursor()
    sql = """
    INSERT INTO comments (video_id, author, text, likes, published_at, feeling)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            video_id,
            comment["author"],
            comment["text"],
            comment["likes"],
            comment["published_at"],
            comment["felling"]
        ) for comment in comments
    ]
    cursor.executemany(sql, values)
    conn.commit()
    cursor.close()
    conn.close()


def update_video_info(video_info, video_id):
    conn = connect()
    cursor = conn.cursor()
    sql = """
    UPDATE videos
    SET views = %s, likes = %s, comments = %s
    WHERE video_id = %s
    """
    values = (
        video_info["views"],
        video_info["likes"],
        video_info["comments"],
        video_id
    )
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()


def update_video_comments(comments, video_id):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT published_at FROM comments
        WHERE video_id = %s
        ORDER BY published_at DESC
        LIMIT 1
    """, (video_id,))

    result = cursor.fetchone()
    latest_date = datetime.strptime(
        result[0], "%Y-%m-%dT%H:%M:%SZ") if result else None

    new_comments = []
    for c in comments:
        comment_date = datetime.strptime(
            c["published_at"], "%Y-%m-%dT%H:%M:%SZ")
        if latest_date is None or comment_date > latest_date:
            new_comments.append((
                video_id,
                c["author"],
                c["text"],
                c["likes"],
                c["published_at"],
                c["felling"]
            ))

    if new_comments:
        sql = """
        INSERT INTO comments (video_id, author, text, likes, published_at, feeling)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, new_comments)
        conn.commit()

    cursor.close()
    conn.close()


def get_video_id_if_exists(code_url, user_id):
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT video_id FROM videos WHERE code_url = %s AND user_id = %s
    """, (code_url, user_id))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else None


def take_videos_by_user(user_id):
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM videos WHERE user_id = %s
    """, (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    videos = []
    for row in rows:
        videos.append({
            "idVideo": row[0],
            "codeURL": row[1],
            "idUsuario": row[2],
            "title": row[3],
            "channel": row[4],
            "publish_date": row[5],
            "views": row[6],
            "likes": row[7],
            "comments": row[8]
        })
    return videos


def video_manager(video_info, comments, user_id):
    video_id = get_video_id_if_exists(video_info["codeURL"], user_id)
    if video_id:
        update_video_info(video_info, video_id)
        update_video_comments(comments, video_id)
    else:
        insert_video_info(video_info, user_id)
        video_id = get_video_id_if_exists(video_info["codeURL"], user_id)
        insert_comments(comments, video_id)


def register_user(username, password):
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT user_id FROM users WHERE username = %s
    """, (username,))
    if cursor.fetchone():
        return False
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, (username, password))
    conn.commit()
    cursor.close()
    conn.close()
    return True


def authenticate_user(username, password):
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT user_id FROM users WHERE username = %s AND password = %s
    """, (username, password))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else None
