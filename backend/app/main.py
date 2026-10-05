from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .gemini_service import generate_content
from .prompts import build_generation_prompt
from .recommendations_service import get_recommendations
from .schemas import (
    GenerateRequest,
    GenerateResponse,
    HealthResponse,
    RecommendationsRequest,
    RecommendationsResponse,
)

app = FastAPI(
    title="MoodMatch API",
    version="0.1.0",
    description="Backend API for MoodMatch creative mood matching.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest) -> GenerateResponse:
    prompt = build_generation_prompt(
        day=request.day,
        desire=request.desire,
        vibe=request.vibe,
        content_type=request.content_type,
    )

    try:
        content = generate_content(prompt)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Gemini generation failed.") from exc

    return GenerateResponse(content_type=request.content_type, content=content)


@app.post("/api/recommendations", response_model=RecommendationsResponse)
def recommendations(request: RecommendationsRequest) -> RecommendationsResponse:
    try:
        data = get_recommendations(
            vibe=request.vibe,
            day=request.day,
            desire=request.desire,
        )
        return RecommendationsResponse(**data)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Recommendations failed: {exc}") from exc
