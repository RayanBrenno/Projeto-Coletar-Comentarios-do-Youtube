from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class YoutubeURLRequest(BaseModel):
    url: HttpUrl
    user_id: str
