from typing import Literal

from pydantic import BaseModel, Field


ContentType = Literal["Quote", "Poem", "Story", "Caption", "Song"]


class GenerateRequest(BaseModel):
    day: str = Field(min_length=1, max_length=500)
    desire: str = Field(min_length=1, max_length=500)
    vibe: str = Field(min_length=1, max_length=100)
    content_type: ContentType


class GenerateResponse(BaseModel):
    content_type: ContentType
    content: str


class HealthResponse(BaseModel):
    status: Literal["ok"]


# --- Recommendations ---

class RecommendationsRequest(BaseModel):
    day: str = Field(min_length=1, max_length=500)
    desire: str = Field(min_length=1, max_length=500)
    vibe: str = Field(min_length=1, max_length=100)


class BookRecommendation(BaseModel):
    type: str = "book"
    title: str
    author: str
    reason: str
    cover_url: str | None = None


class ArticleRecommendation(BaseModel):
    type: str = "article"
    title: str
    source: str
    reason: str
    url: str = ""


class VideoRecommendation(BaseModel):
    type: str = "youtube"
    title: str
    channel: str
    thumbnail: str
    url: str
    reason: str


class RecommendationsResponse(BaseModel):
    books: list[BookRecommendation] = []
    articles: list[ArticleRecommendation] = []
    videos: list[VideoRecommendation] = []
