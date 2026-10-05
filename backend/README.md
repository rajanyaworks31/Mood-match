# MoodMatch Backend

FastAPI backend for MoodMatch. The backend accepts mood context and a requested content type, then uses Gemini to generate the requested format.

## Run locally

From `D:\Mood-match\backend`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
uvicorn app.main:app --reload
```

The API will run at `http://127.0.0.1:8000`.

## Endpoints

- `GET /api/health` — basic server health check.
- `POST /api/generate` — generates a Quote, Poem, Story, Caption, or Song from the supplied mood context.
- `GET /docs` — FastAPI interactive API documentation.

### Example request

```json
{
  "day": "Tiring and dull",
  "desire": "Lying down and thinking",
  "vibe": "Melancholy",
  "content_type": "Story"
}
```

The response includes the same `content_type` and the generated content. The content type is enforced in the Gemini prompt, so choosing `Story` no longer falls back to a quote.

## Frontend boundary

The React app in `..\frontend` will call `POST /api/generate` from `http://localhost:5173`. The existing Streamlit prototype at the repository root remains unchanged during this backend phase.
