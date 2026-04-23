from fastapi import APIRouter
from app.schemas.youtube import (
    YoutubeURLRequest,
    VideoInfoResponse,
    VideoCommentsResponse,
)
from app.services.youtube_service import (
    get_code_url,
    get_video_info,
    get_all_comments,
)
from app.youtube_repository import (
    video_manager,
    take_comments_by_video_id,
    take_videos_by_user,
)

router = APIRouter(prefix="/youtube", tags=["youtube"])


@router.post("/video-info", response_model=VideoInfoResponse)
def fetch_video_info(payload: YoutubeURLRequest):
    video_id = get_code_url(str(payload.url))
    video_info = get_video_info(video_id)

    # salva ou atualiza os dados do vídeo no banco
    video_manager(video_info, [], payload.user_id)

    return video_info


@router.post("/comments", response_model=VideoCommentsResponse)
def fetch_video_comments(payload: YoutubeURLRequest):
    video_id = get_code_url(str(payload.url))
    video_info = get_video_info(video_id)
    comments = get_all_comments(video_id)

    # salva/atualiza vídeo + comentários
    saved_video_id = video_manager(video_info, comments, payload.user_id)
    saved_comments = take_comments_by_video_id(saved_video_id)

    normalized_comments = [
        {
            "author": comment["author"],
            "text": comment["text"],
            "likes": comment["likes"],
            "published_at": comment["published_at"],
        }
        for comment in saved_comments
    ]

    return {
        "video_id": saved_video_id,
        "total_comments": len(normalized_comments),
        "comments": normalized_comments,
    }

@router.get("/history/{user_id}")
def fetch_video_history(user_id: str):
    return take_videos_by_user(user_id)


@router.post("/full-data")
def fetch_full_video_data(payload: YoutubeURLRequest):
    video_id = get_code_url(str(payload.url))
    video_info = get_video_info(video_id)
    comments = get_all_comments(video_id)

    # salva/atualiza vídeo + comentários
    saved_video_id = video_manager(video_info, comments, payload.user_id)
    saved_comments = take_comments_by_video_id(saved_video_id)

    normalized_comments = [
        {
            "author": comment["author"],
            "text": comment["text"],
            "likes": comment["likes"],
            "published_at": comment["published_at"],
        }
        for comment in saved_comments
    ]

    return {
        "video_id": saved_video_id,
        "video": video_info,
        "total_comments": len(normalized_comments),
        "comments": normalized_comments,
    }