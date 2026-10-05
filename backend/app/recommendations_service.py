import os
import json
import httpx
from pathlib import Path
from urllib.parse import quote_plus
from dotenv import load_dotenv
from .gemini_service import generate_content

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
OPENLIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPENLIBRARY_COVER_URL = "https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"


# ---------------------------------------------------------------------------
# Gemini: generate book + article recommendations as structured JSON
# ---------------------------------------------------------------------------

def _gemini_recommendations(vibe: str, day: str, desire: str) -> list[dict]:
    prompt = f"""You are a warm, emotionally intelligent recommendation engine for the app MoodMatch.

A user is feeling: {vibe}
Their day was: {day}
They feel like: {desire}

Suggest exactly 2 books and 2 articles that would genuinely help or resonate with this mood.

Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences. Example format:
[
  {{
    "type": "book",
    "title": "The Midnight Library",
    "author": "Matt Haig",
    "reason": "A gentle story about second chances that speaks to feeling lost.",
    "search_query": "The Midnight Library Matt Haig"
  }},
  {{
    "type": "article",
    "title": "Why Your Emotions Are Valid",
    "source": "Psychology Today",
    "reason": "A warm, accessible read that normalises whatever you're feeling.",
    "url": ""
  }}
]

Rules:
- 2 books (type: "book") and 2 articles (type: "article")
- Books must have: title, author, reason, search_query
- Articles must have: title, source, reason (url can be empty string)
- Keep reasons warm, personal and 1 sentence
- Match the emotional tone closely — don't suggest upbeat books for grief
- Return ONLY the JSON array, nothing else
"""
    raw = generate_content(prompt)
    # Strip any accidental markdown fences
    clean = raw.strip().strip("```json").strip("```").strip()
    return json.loads(clean)


# ---------------------------------------------------------------------------
# Open Library: fetch book cover by title+author search
# ---------------------------------------------------------------------------

def _openlibrary_cover(search_query: str) -> str | None:
    try:
        resp = httpx.get(
            OPENLIBRARY_SEARCH_URL,
            params={"q": search_query, "limit": 1, "fields": "cover_i,title"},
            timeout=8.0,
        )
        resp.raise_for_status()
        docs = resp.json().get("docs", [])
        if docs and docs[0].get("cover_i"):
            cover_id = docs[0]["cover_i"]
            return OPENLIBRARY_COVER_URL.format(cover_id=cover_id)
    except Exception as exc:
        print(f"[recommendations] Open Library cover fetch failed: {exc}")
    return None


# ---------------------------------------------------------------------------
# YouTube: search for mood-relevant videos
# ---------------------------------------------------------------------------

def _youtube_videos(vibe: str, day: str, desire: str) -> list[dict]:
    api_key = os.getenv("YOUTUBE_API_KEY", "").strip()
    if not api_key:
        print("[recommendations] YOUTUBE_API_KEY not set, skipping YouTube")
        return []

    mood_queries = {
        "Calm": ["calming mindfulness meditation", "peaceful nature sounds relaxation", "gentle evening reset"],
        "Tired": ["gentle reset when mentally tired", "rest and recharge self care", "relaxing slow living"],
        "Overwhelmed": ["grounding techniques when overwhelmed", "how to reset when overwhelmed", "simple stress relief"],
        "Melancholy": ["comforting reflective conversation", "healing from sadness gentle advice", "melancholy reflective music"],
        "Anxious": ["guided breathing for anxiety", "grounding techniques for anxiety", "calming anxiety psychology"],
        "Happy": ["feel good celebration music", "uplifting happy playlist", "joyful things to watch"],
        "Inspired": ["creative inspiration talk", "motivation for building something", "TED style creativity talk"],
        "Lonely": ["comforting talk about loneliness", "feeling less alone psychology", "wholesome conversation podcast"],
        "Grateful": ["gratitude practice positive psychology", "meaningful uplifting stories", "gratitude meditation"],
    }
    queries = mood_queries.get(vibe, [
        f"{vibe} mood support",
        f"how to feel better when {vibe}",
        f"{vibe} self care",
    ])

    videos = []
    seen_ids = set()
    for query in queries:
        try:
            resp = httpx.get(
                YOUTUBE_SEARCH_URL,
                params={
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "maxResults": 2,
                    "key": api_key,
                    "order": "relevance",
                    "safeSearch": "strict",
                    "relevanceLanguage": "en",
                },
                timeout=8.0,
            )
            resp.raise_for_status()
            payload = resp.json()
            if payload.get("error"):
                error = payload["error"]
                print(f"[recommendations] YouTube API error: {error.get('code')} - {error.get('message')}")
                continue
            items = payload.get("items", [])
            for item in items:
                video_id = item.get("id", {}).get("videoId")
                if not video_id or video_id in seen_ids:
                    continue
                snippet = item["snippet"]
                videos.append({
                    "type": "youtube",
                    "title": snippet["title"],
                    "channel": snippet["channelTitle"],
                    "thumbnail": snippet["thumbnails"]["medium"]["url"],
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "reason": f"A video to match your {vibe.lower()} energy right now.",
                })
                seen_ids.add(video_id)
                if len(videos) >= 3:
                    break
        
            if len(videos) >= 3:
                break
        except Exception as exc:
            print(f"[recommendations] YouTube search failed for '{query}': {exc}")

    return videos


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def get_recommendations(vibe: str, day: str, desire: str) -> dict:
    """
    Returns:
    {
      "books": [...],
      "articles": [...],
      "videos": [...],
    }
    """
    print(f"[recommendations] Fetching for vibe={vibe}, day={day}, desire={desire}")

    # 1. Gemini: books + articles
    gemini_recs = []
    try:
        gemini_recs = _gemini_recommendations(vibe, day, desire)
        print(f"[recommendations] Gemini returned {len(gemini_recs)} items")
    except Exception as exc:
        print(f"[recommendations] Gemini recs failed: {exc}")

    books = [r for r in gemini_recs if r.get("type") == "book"]
    articles = [r for r in gemini_recs if r.get("type") == "article"]

    # Gemini may omit an article URL. Use a deterministic search link rather
    # than inventing a direct article URL that may not exist.
    for article in articles:
        if not article.get("url"):
            search_text = f"{article.get('title', '')} {article.get('source', '')}".strip()
            article["url"] = f"https://www.google.com/search?q={quote_plus(search_text)}"

    # 2. Open Library: enrich books with cover images
    for book in books:
        query = book.get("search_query") or f"{book.get('title', '')} {book.get('author', '')}"
        book["cover_url"] = _openlibrary_cover(query)

    # 3. YouTube: mood videos
    videos = _youtube_videos(vibe, day, desire)
    print(f"[recommendations] YouTube returned {len(videos)} videos")

    return {"books": books, "articles": articles, "videos": videos}
