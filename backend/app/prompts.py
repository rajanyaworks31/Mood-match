from .schemas import ContentType


_CONTENT_INSTRUCTIONS: dict[ContentType, str] = {
    "Quote": "Write one original, concise quote (1-2 sentences). Do not add a title or explanation.",
    "Poem": "Write a short original poem of 8-16 lines. Use line breaks and imagery. Do not add an explanation.",
    "Story": "Write a short original reflective story of 250-400 words with a clear beginning, middle, and ending. Do not add an explanation.",
    "Caption": "Write one original social-media caption of 1-3 sentences. Keep it natural and not overly promotional. Do not add hashtags unless they genuinely fit.",
    "Song": "Write a short original song concept with a title, one verse, and a chorus. Keep it concise. Do not imitate any existing artist or song.",
}


def build_generation_prompt(day: str, desire: str, vibe: str, content_type: ContentType) -> str:
    instruction = _CONTENT_INSTRUCTIONS[content_type]

    return f"""You are MoodMatch, a gentle creative companion.

Create the requested type of original content from the user's emotional context.
The content type is authoritative: you MUST produce a {content_type}, not a quote or another format.

User's day: {day}
What they feel like doing: {desire}
Their chosen vibe: {vibe}

Format requirements:
{instruction}

Tone:
- emotionally aware, warm, and approachable
- reflective rather than clinical
- never diagnose or make mental-health claims
- avoid clichés where possible
- do not mention that you are an AI
"""
