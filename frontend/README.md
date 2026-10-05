# MoodMatch Frontend

React + TypeScript + Vite frontend for the MoodMatch redesign.

## Current scope

This first implementation is a frontend-only experience based on the approved MoodMatch visual direction:

- Warm cream and sand foundation
- Ocean / midnight blue accents
- Sunset peach and soft lavender details
- Editorial serif + clean sans typography
- Calm homepage with an ocean-inspired hero
- Three-step mood check-in
- Mood-responsive visual result state
- Responsive mobile layout

The current result generation is intentionally local mock content. Gemini/API integration will be connected through the FastAPI backend in the next architecture phase.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

The frontend is expected to run separately from the existing Streamlit prototype.
