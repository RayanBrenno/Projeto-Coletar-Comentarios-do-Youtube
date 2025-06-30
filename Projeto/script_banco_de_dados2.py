from pymongo import MongoClient, errors
from datetime import datetime

# Conexão com MongoDB Atlas
client = MongoClient("mongodb+srv://RayanBrenno:rayan123@rayan.e8buede.mongodb.net/")
db = client["projetopython"]

# === USERS ===
def create_users_collection():
    if "users" not in db.list_collection_names():
        db.create_collection("users")
        db["users"].create_index("username", unique=True)

def register_user(username, password):
    try:
        db["users"].insert_one({"username": username, "password": password})
        return True
    except errors.DuplicateKeyError:
        return False

def authenticate_user(username, password):
    user = db["users"].find_one({"username": username, "password": password})
    return str(user["_id"]) if user else None

# === VIDEOS ===
def insert_video_info(video_info, user_id):
    video = {
        "code_url": video_info["codeURL"],
        "user_id": user_id,
        "title": video_info["title"],
        "channel": video_info["channel"],
        "publish_date": video_info["publish_date"],
        "views": video_info["views"],
        "likes": video_info["likes"],
        "comments": video_info["comments"]
    }
    db["videos"].insert_one(video)

def get_video_id_if_exists(code_url, user_id):
    video = db["videos"].find_one({"code_url": code_url, "user_id": user_id})
    return str(video["_id"]) if video else None

def update_video_info(video_info, video_id):
    from bson import ObjectId
    db["videos"].update_one(
        {"_id": ObjectId(video_id)},
        {"$set": {
            "views": video_info["views"],
            "likes": video_info["likes"],
            "comments": video_info["comments"]
        }}
    )

def take_videos_by_user(user_id):
    videos = db["videos"].find({"user_id": user_id})
    return [{
        "idVideo": str(v["_id"]),
        "codeURL": v["code_url"],
        "idUsuario": v["user_id"],
        "title": v["title"],
        "channel": v["channel"],
        "publish_date": v["publish_date"],
        "views": v["views"],
        "likes": v["likes"],
        "comments": v["comments"]
    } for v in videos]

# === COMMENTS ===
def insert_comments(comments, video_id):
    for comment in comments:
        comment["video_id"] = video_id
    if comments:
        db["comments"].insert_many(comments)

def update_video_comments(comments, video_id):
    last_comment = db["comments"].find({"video_id": video_id}).sort("published_at", -1).limit(1)
    latest_date = None
    for c in last_comment:
        latest_date = datetime.strptime(c["published_at"], "%Y-%m-%dT%H:%M:%SZ")

    new_comments = []
    for c in comments:
        comment_date = datetime.strptime(c["published_at"], "%Y-%m-%dT%H:%M:%SZ")
        if latest_date is None or comment_date > latest_date:
            c["video_id"] = video_id
            new_comments.append(c)

    if new_comments:
        db["comments"].insert_many(new_comments)

# === GESTÃO COMPLETA ===
def video_manager(video_info, comments, user_id):
    video_id = get_video_id_if_exists(video_info["codeURL"], user_id)
    if video_id:
        update_video_info(video_info, video_id)
        update_video_comments(comments, video_id)
    else:
        insert_video_info(video_info, user_id)
        video_id = get_video_id_if_exists(video_info["codeURL"], user_id)
        insert_comments(comments, video_id)
