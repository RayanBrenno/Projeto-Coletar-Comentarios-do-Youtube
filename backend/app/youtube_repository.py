from datetime import datetime
from bson import ObjectId
from app.database import db


def insert_video_info(video_info: dict, user_id: str) -> str:
    now = datetime.utcnow()

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
        "consulted_at": now,
        "last_updated_at": video_info.get("last_updated_at") or now,
    }

    result = db["videos"].insert_one(video)
    return str(result.inserted_id)


def get_video_by_code_url_and_user(code_url: str, user_id: str) -> dict | None:
    return db["videos"].find_one(
        {
            "code_url": code_url,
            "user_id": user_id,
        }
    )


def get_video_id_if_exists(code_url: str, user_id: str) -> str | None:
    video = get_video_by_code_url_and_user(code_url, user_id)

    if not video:
        return None

    return str(video["_id"])


def get_video_by_id_and_user(video_id: str, user_id: str) -> dict | None:
    if not ObjectId.is_valid(video_id):
        return None

    return db["videos"].find_one(
        {
            "_id": ObjectId(video_id),
            "user_id": user_id,
        }
    )


def update_video_info(video_info: dict, video_id: str) -> None:
    now = datetime.utcnow()

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
                "last_updated_at": video_info.get("last_updated_at") or now,
            }
        },
    )


def update_video_by_id(
    video_id: str,
    video_info: dict,
    comments: list[dict],
    user_id: str,
) -> str:
    existing_video = get_video_by_id_and_user(video_id, user_id)

    if not existing_video:
        raise ValueError("Vídeo não encontrado para este usuário.")

    update_video_info(video_info, video_id)
    update_video_comments(comments, video_id)

    return video_id


def get_videos_by_user(user_id: str) -> list[dict]:
    videos = db["videos"].find({"user_id": user_id}).sort("last_updated_at", -1)

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
            "consulted_at": video.get("consulted_at"),
            "last_updated_at": video.get("last_updated_at"),
        }
        for video in videos
    ]


def insert_comments(comments: list[dict], video_id: str) -> None:
    if not comments:
        return

    comments_to_insert = []

    for comment in comments:
        comments_to_insert.append(
            {
                **comment,
                "video_id": video_id,
            }
        )

    db["comments"].insert_many(comments_to_insert)


def get_latest_comment_date(video_id: str):
    last_comment = (
        db["comments"]
        .find({"video_id": video_id})
        .sort("published_at", -1)
        .limit(1)
    )

    latest_date = None

    for comment in last_comment:
        latest_date = datetime.strptime(
            comment["published_at"],
            "%Y-%m-%dT%H:%M:%SZ",
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
            "%Y-%m-%dT%H:%M:%SZ",
        )

        if latest_date is None or comment_date > latest_date:
            new_comments.append(
                {
                    **comment,
                    "video_id": video_id,
                }
            )

    if new_comments:
        db["comments"].insert_many(new_comments)


def get_comments_by_video_id(video_id: str) -> list[dict]:
    comments = list(
        db["comments"]
        .find({"video_id": video_id})
        .sort("published_at", -1)
    )

    return [
        {
            **comment,
            "_id": str(comment["_id"]),
            "intencao": comment.get("intencao"),
            "score": comment.get("score"),
        }
        for comment in comments
    ]


def get_dashboard_summary(user_id: str) -> dict:
    videos = list(db["videos"].find({"user_id": user_id}))

    total_videos = len(videos)
    total_views = sum(int(v.get("views") or 0) for v in videos)
    total_likes = sum(int(v.get("likes") or 0) for v in videos)
    total_video_comments = sum(int(v.get("comments") or 0) for v in videos)

    video_ids = [str(v["_id"]) for v in videos]

    sentiment_counts = {"positivo": 0, "neutro": 0, "negativo": 0}
    total_collected_comments = 0

    if video_ids:
        pipeline = [
            {"$match": {"video_id": {"$in": video_ids}}},
            {"$group": {"_id": "$intencao", "count": {"$sum": 1}}},
        ]

        for row in db["comments"].aggregate(pipeline):
            key = (row.get("_id") or "").lower()
            count = int(row.get("count") or 0)
            total_collected_comments += count

            if key in sentiment_counts:
                sentiment_counts[key] += count

    latest_video = None
    top_videos: list[dict] = []

    if videos:
        sorted_by_date = sorted(
            videos,
            key=lambda v: v.get("last_updated_at") or v.get("consulted_at") or datetime.min,
            reverse=True,
        )
        latest = sorted_by_date[0]
        latest_video = {
            "id": str(latest["_id"]),
            "code_url": latest.get("code_url"),
            "title": latest.get("title"),
            "channel": latest.get("channel"),
            "thumbnail_url": latest.get("thumbnail_url"),
            "views": int(latest.get("views") or 0),
            "likes": int(latest.get("likes") or 0),
            "comments": int(latest.get("comments") or 0),
            "last_updated_at": latest.get("last_updated_at"),
        }

        sorted_by_views = sorted(
            videos,
            key=lambda v: int(v.get("views") or 0),
            reverse=True,
        )[:5]

        top_videos = [
            {
                "id": str(v["_id"]),
                "code_url": v.get("code_url"),
                "title": v.get("title"),
                "channel": v.get("channel"),
                "thumbnail_url": v.get("thumbnail_url"),
                "views": int(v.get("views") or 0),
                "likes": int(v.get("likes") or 0),
                "comments": int(v.get("comments") or 0),
            }
            for v in sorted_by_views
        ]

    return {
        "total_videos": total_videos,
        "total_views": total_views,
        "total_likes": total_likes,
        "total_video_comments": total_video_comments,
        "total_collected_comments": total_collected_comments,
        "sentiment": {
            **sentiment_counts,
            "total": total_collected_comments,
        },
        "latest_video": latest_video,
        "top_videos": top_videos,
    }


def video_manager(video_info: dict, comments: list[dict], user_id: str) -> str:
    video_id = get_video_id_if_exists(video_info["codeURL"], user_id)

    if video_id:
        update_video_info(video_info, video_id)
        update_video_comments(comments, video_id)
        return video_id

    new_video_id = insert_video_info(video_info, user_id)
    insert_comments(comments, new_video_id)

    return new_video_id
