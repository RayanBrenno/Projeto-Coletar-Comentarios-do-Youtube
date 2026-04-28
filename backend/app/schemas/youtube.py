from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class YoutubeURLRequest(BaseModel):
    url: HttpUrl
    user_id: str


class VideoInfoResponse(BaseModel):
    codeURL: str
    title: str
    channel: str
    publish_date: str
    views: int
    likes: int
    comments: int
    thumbnail_url: Optional[str] = None
    last_updated_at: Optional[str] = None


class CommentResponse(BaseModel):
    author: str
    text: str
    likes: int
    published_at: str
    intencao: Optional[str] = None
    score: Optional[float] = None


class VideoCommentsResponse(BaseModel):
    video_id: str
    total_comments: int
    comments: List[CommentResponse]