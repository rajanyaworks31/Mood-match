# 🌿 MoodMatch

> **Where every mood finds a perfect match.**

MoodMatch is a mood-based wellbeing web application designed to help users understand and express how they feel through personalized creative content and meaningful recommendations.

Instead of simply asking users to "cheer up", MoodMatch meets them where they are — whether they're overwhelmed, anxious, lonely, calm, inspired, happy, or simply having a difficult day.

---

## ✨ What is MoodMatch?

MoodMatch allows users to:

- 🧠 Check in with their current mood
- ✍️ Express how they're feeling through a guided experience
- 💬 Receive personalized AI-generated content
- 📚 Discover books related to their emotional state
- 📰 Explore relevant articles and reading material
- 🎥 Find YouTube videos matching their mood
- 💾 Save meaningful results for later reflection
- 🔄 Generate something new whenever they want

The goal is to create a gentle, personalized digital space where users can **understand, express, and engage with their emotions**.

---

## 🎯 Problem It Solves

People often know that they aren't feeling okay but don't always know what to do with that feeling.

MoodMatch provides a simple way to:

**Recognize → Express → Receive → Reflect**

Instead of giving generic wellness advice, the application uses the user's current emotional context to generate and recommend content that feels more relevant to them.

---

## 🚀 Key Features

### 🧠 Mood Check-In

Users select and describe their current emotional state through an interactive check-in experience.

### ✨ AI-Powered Creative Responses

MoodMatch uses Gemini to generate personalized:

- Quotes
- Poems
- Short stories
- Captions
- Song suggestions

based on the user's mood and preferences.

### 📚 Mood-Based Book Recommendations

Books are recommended according to the user's emotional state.

Book information and cover images are retrieved using the **Open Library API**.

### 📰 Personalized Article Recommendations

The application generates reading recommendations designed around the user's current mood and situation.

### 🎥 YouTube Recommendations

MoodMatch uses the **YouTube Data API** to find videos relevant to the user's emotional state — including calming, grounding, motivational, reflective, and uplifting content.

### 💾 Save & Reflect

Users can save meaningful results and return to them later.

### 🎨 Mood-Centered UI

The interface uses soft gradients, illustrations, animations, interactive cards, and progressive reveal effects to create a calm and immersive experience.

---

## 🏗️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide Icons

### Backend

- Python
- FastAPI
- Pydantic
- REST APIs

### AI & APIs

- Google Gemini API
- YouTube Data API
- Open Library API

### Development

- Git & GitHub
- ESLint
- Pytest

---

## 🧩 Architecture

```text
                    ┌──────────────────────┐
                    │      MoodMatch       │
                    │      Frontend        │
                    │ React + TypeScript   │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌──────────────┐  ┌──────────────┐
       │   Gemini   │   │  YouTube API │  │ Open Library │
       │     AI     │   │              │  │     API      │
       └────────────┘   └──────────────┘  └──────────────┘
              │                │                │
              ▼                ▼                ▼
        AI-generated       Mood-based       Book data &
          content            videos           covers







## How It Works

User selects mood
       ↓
Mood + preferences collected
       ↓
FastAPI processes the request
       ↓
Gemini generates personalized content
       ↓
Recommendation engine searches:
   ├── Books → Open Library
   ├── Articles → AI-generated recommendations
   └── Videos → YouTube Data API
       ↓
Personalized result page
       ↓
User can Save or Make Another
