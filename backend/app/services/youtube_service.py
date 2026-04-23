from googleapiclient.discovery import build
from fastapi import HTTPException
from datetime import datetime, timezone
import os


YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def get_youtube_client():
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY não configurada.")
    return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)


def get_code_url(url: str) -> str:
    try:
        video_id = ""

        if "youtube.com/watch?v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            video_id = url.split("/")[-1].split("?")[0]
        else:
            raise HTTPException(status_code=400, detail="Formato de URL inválido.")

        if len(video_id) != 11:
            raise HTTPException(status_code=400, detail="Video ID inválido.")

        return video_id

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar URL: {str(e)}")


def get_best_thumbnail_url(thumbnails: dict) -> str | None:
    """
    Prioriza a melhor thumbnail disponível.
    Ordem: maxres > standard > high > medium > default
    """
    if not thumbnails:
        return None

    priority = ["maxres", "standard", "high", "medium", "default"]

    for key in priority:
        thumb = thumbnails.get(key)
        if thumb and thumb.get("url"):
            return thumb["url"]

    return None


def get_video_info(video_id: str) -> dict:
    try:
        youtube = get_youtube_client()
        request = youtube.videos().list(
            part="snippet,statistics",
            id=video_id
        )
        response = request.execute()

        if "items" not in response or len(response["items"]) == 0:
            raise HTTPException(status_code=404, detail="Vídeo não encontrado.")

        video = response["items"][0]
        snippet = video.get("snippet", {})
        statistics = video.get("statistics", {})
        thumbnails = snippet.get("thumbnails", {})

        return {
            "codeURL": video_id,
            "title": snippet.get("title", "Untitled"),
            "channel": snippet.get("channelTitle", "Unknown Channel"),
            "publish_date": snippet.get("publishedAt", "N/A"),
            "views": int(statistics.get("viewCount", 0)),
            "likes": int(statistics.get("likeCount", 0)),
            "comments": int(statistics.get("commentCount", 0)),
            "thumbnail_url": get_best_thumbnail_url(thumbnails),
            "last_updated_at": datetime.now(timezone.utc).isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar vídeo: {str(e)}")


def get_all_comments(video_id: str) -> list[dict]:
    try:
        youtube = get_youtube_client()
        comments = []
        next_page_token = None

        while True:
            request = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                pageToken=next_page_token,
                textFormat="plainText",
                order="time"
            )
            response = request.execute()

            for item in response.get("items", []):
                snippet = item["snippet"]["topLevelComment"]["snippet"]

                comments.append({
                    "author": snippet.get("authorDisplayName", "Anonymous"),
                    "text": snippet.get("textDisplay", ""),
                    "likes": int(snippet.get("likeCount", 0)),
                    "published_at": snippet.get("publishedAt", ""),
                })

            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break

        return comments

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar comentários: {str(e)}")