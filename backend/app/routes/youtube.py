from fastapi import APIRouter, HTTPException

from app.schemas.youtube import YoutubeURLRequest

from app.services.youtube_service import (
    get_code_url,
    get_video_info,
    get_all_comments,
)

from app.youtube_repository import (
    video_manager,
    take_comments_by_video_id,
    take_videos_by_user,
    take_video_by_code_url_and_user,
    take_video_by_id_and_user,
    update_video_by_id,
)

router = APIRouter(prefix="/youtube", tags=["youtube"])


@router.post("/check-video")
def check_video(payload: YoutubeURLRequest):
    video_code_url = get_code_url(str(payload.url))

    existing_video = take_video_by_code_url_and_user(
        code_url=video_code_url,
        user_id=payload.user_id,
    )

    if not existing_video:
        return {
            "exists": False,
            "video": None,
        }

    return {
        "exists": True,
        "video": {
            "id": str(existing_video["_id"]),
            "code_url": existing_video.get("code_url"),
            "title": existing_video.get("title"),
            "channel": existing_video.get("channel"),
            "thumbnail_url": existing_video.get("thumbnail_url"),
            "last_updated_at": existing_video.get("last_updated_at"),
            "consulted_at": existing_video.get("consulted_at"),
            "views": existing_video.get("views"),
            "likes": existing_video.get("likes"),
            "comments": existing_video.get("comments"),
        },
    }


@router.get("/history/{user_id}")
def fetch_video_history(user_id: str):
    return take_videos_by_user(user_id)


@router.post("/full-data")
def fetch_full_video_data(payload: YoutubeURLRequest):
    video_id = get_code_url(str(payload.url))
    video_info = get_video_info(video_id)
    comments = get_all_comments(video_id)

    saved_video_id = video_manager(video_info, comments, payload.user_id)
    saved_comments = take_comments_by_video_id(saved_video_id)

    comments_response = [
        {
            "author": comment["author"],
            "text": comment["text"],
            "likes": comment["likes"],
            "published_at": comment["published_at"],
            "intencao": comment["intencao"],
            "score": comment["score"],
        }
        for comment in saved_comments
    ]

    return {
        "video_id": saved_video_id,
        "video": video_info,
        "total_comments": len(comments_response),
        "comments": comments_response,
    }


@router.post("/videos/{video_id}/update")
def update_saved_video(video_id: str, user_id: str):
    old_video = take_video_by_id_and_user(
        video_id=video_id,
        user_id=user_id,
    )

    if not old_video:
        raise HTTPException(
            status_code=404,
            detail="Vídeo não encontrado para este usuário.",
        )

    code_url = old_video.get("code_url")

    if not code_url:
        raise HTTPException(
            status_code=400,
            detail="Vídeo salvo não possui code_url.",
        )

    new_video_info = get_video_info(code_url)
    new_comments = get_all_comments(code_url)

    saved_video_id = update_video_by_id(
        video_id=video_id,
        video_info=new_video_info,
        comments=new_comments,
        user_id=user_id,
    )

    saved_comments = take_comments_by_video_id(saved_video_id)

    comments_response = [
        {
            "author": comment["author"],
            "text": comment["text"],
            "likes": comment["likes"],
            "published_at": comment["published_at"],
            "intencao": comment["intencao"],
            "score": comment["score"],
        }
        for comment in saved_comments
    ]

    old_views = int(old_video.get("views") or 0)
    old_likes = int(old_video.get("likes") or 0)
    old_comments_count = int(old_video.get("comments") or 0)

    new_views = int(new_video_info.get("views") or 0)
    new_likes = int(new_video_info.get("likes") or 0)
    new_comments_count = int(new_video_info.get("comments") or 0)

    return {
        "video_id": str(saved_video_id),
        "video": new_video_info,
        "total_comments": len(comments_response),
        "comments": comments_response,
        "previous": {
            "views": old_views,
            "likes": old_likes,
            "comments": old_comments_count,
            "last_updated_at": old_video.get("last_updated_at"),
        },
        "current": {
            "views": new_views,
            "likes": new_likes,
            "comments": new_comments_count,
        },
        "diff": {
            "views": new_views - old_views,
            "likes": new_likes - old_likes,
            "comments": new_comments_count - old_comments_count,
        },
    }