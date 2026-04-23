from datetime import datetime
from bson import ObjectId
from app.database import db


def insert_video_info(video_info: dict, user_id: str) -> str:
    video = {
        "code_url": video_info["codeURL"],
        "user_id": user_id,
        "title": video_info["title"],
        "channel": video_info["channel"],
        "publish_date": video_info["publish_date"],
        "views": video_info["views"],
        "likes": video_info["likes"],
        "comments": video_info["comments"],
        "thumbnail_url": video_info.get("thumbnail_url"),
        "last_updated_at": video_info.get("last_updated_at"),
    }

    result = db["videos"].insert_one(video)
    return str(result.inserted_id)


def get_video_by_code_url_and_user(code_url: str, user_id: str) -> dict | None:
    return db["videos"].find_one({
        "code_url": code_url,
        "user_id": user_id
    })


def get_video_id_if_exists(code_url: str, user_id: str) -> str | None:
    video = get_video_by_code_url_and_user(code_url, user_id)
    if not video:
        return None
    return str(video["_id"])


def update_video_info(video_info: dict, video_id: str) -> None:
    db["videos"].update_one(
        {"_id": ObjectId(video_id)},
        {
            "$set": {
                "title": video_info["title"],
                "channel": video_info["channel"],
                "publish_date": video_info["publish_date"],
                "views": video_info["views"],
                "likes": video_info["likes"],
                "comments": video_info["comments"],
                "thumbnail_url": video_info.get("thumbnail_url"),
                "last_updated_at": video_info.get("last_updated_at"),
            }
        }
    )


def take_videos_by_user(user_id: str) -> list[dict]:
    videos = db["videos"].find({"user_id": user_id})

    return [
        {
            "idVideo": str(video["_id"]),
            "codeURL": video["code_url"],
            "idUsuario": video["user_id"],
            "title": video["title"],
            "channel": video["channel"],
            "publish_date": video["publish_date"],
            "views": video["views"],
            "likes": video["likes"],
            "comments": video["comments"],
            "thumbnail_url": video.get("thumbnail_url"),
            "last_updated_at": video.get("last_updated_at"),
        }
        for video in videos
    ]


def insert_comments(comments: list[dict], video_id: str) -> None:
    if not comments:
        return

    comments_to_insert = []
    for comment in comments:
        comments_to_insert.append({
            **comment,
            "video_id": video_id
        })

    db["comments"].insert_many(comments_to_insert)


def get_latest_comment_date(video_id: str):
    last_comment = db["comments"].find(
        {"video_id": video_id}
    ).sort("published_at", -1).limit(1)

    latest_date = None

    for comment in last_comment:
        latest_date = datetime.strptime(
            comment["published_at"],
            "%Y-%m-%dT%H:%M:%SZ"
        )

    return latest_date


def update_video_comments(comments: list[dict], video_id: str) -> None:
    if not comments:
        return

    latest_date = get_latest_comment_date(video_id)
    new_comments = []

    for comment in comments:
        comment_date = datetime.strptime(
            comment["published_at"],
            "%Y-%m-%dT%H:%M:%SZ"
        )

        if latest_date is None or comment_date > latest_date:
            new_comments.append({
                **comment,
                "video_id": video_id
            })

    if new_comments:
        db["comments"].insert_many(new_comments)


def take_comments_by_video_id(video_id: str) -> list[dict]:
    comments = list(db["comments"].find({"video_id": video_id}))

    return [
        {
            **comment,
            "_id": str(comment["_id"])
        }
        for comment in comments
    ]


def video_manager(video_info: dict, comments: list[dict], user_id: str) -> str:
    video_id = get_video_id_if_exists(video_info["codeURL"], user_id)

    if video_id:
        update_video_info(video_info, video_id)
        update_video_comments(comments, video_id)
        return video_id

    new_video_id = insert_video_info(video_info, user_id)
    insert_comments(comments, new_video_id)
    return new_video_id