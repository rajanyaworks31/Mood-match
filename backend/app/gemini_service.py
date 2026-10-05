import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-3.6-flash"
FALLBACK_MODEL = "gemini-3.5-flash-lite"


def _get_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    return key


def generate_content(prompt: str) -> str:
    api_key = _get_api_key()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    print(f"[gemini_service] Key loaded (first 8): {api_key[:8]}")
    print(f"[gemini_service] Model: {MODEL_NAME}")
    print(f"[gemini_service] Prompt (first 80): {prompt[:80]}")

    try:
        client = genai.Client(api_key=api_key)
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )
            print(f"[gemini_service] Used model: {MODEL_NAME}")
        except Exception as primary_exc:
            # Primary model quota exhausted — try fallback
            primary_error = str(primary_exc)
            if (
                "429" in primary_error
                or "RESOURCE_EXHAUSTED" in primary_error
                or "404" in primary_error
                or "503" in primary_error
                or "UNAVAILABLE" in primary_error
            ):
                print(f"[gemini_service] Primary model failed ({primary_exc}), trying fallback: {FALLBACK_MODEL}")
                response = client.models.generate_content(
                    model=FALLBACK_MODEL,
                    contents=prompt,
                )
                print(f"[gemini_service] Used fallback model: {FALLBACK_MODEL}")
            else:
                raise
    except Exception as exc:
        print(f"[gemini_service] SDK error: {type(exc).__name__}: {exc}")
        raise RuntimeError(f"Gemini SDK error: {exc}") from exc

    content = response.text
    print(f"[gemini_service] Response text (first 80): {str(content)[:80]}")

    if not content:
        raise RuntimeError("Gemini returned an empty response.")

    return content.strip()
