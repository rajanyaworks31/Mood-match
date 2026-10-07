# 🌿 MoodMatch

> **Where every mood finds a perfect match.**

MoodMatch is an AI-powered mood-based wellbeing web application that helps users turn their emotions into personalized experiences. Users can select their current mood and receive AI-generated **quotes, poems, stories, captions, and song suggestions**, along with curated **books, articles, and YouTube videos** related to their emotional state.

The project combines a modern React frontend, FastAPI backend, Generative AI, and multiple external APIs to create an interactive and personalized wellbeing experience.

---

## 🌐 Live Demo

🚀 **Live Application:**  
https://mood-match1.vercel.app/

🔗 **Backend API:**  
https://mood-match-theta.vercel.app/

---

## ✨ Features

### 🎭 Mood-Based Content Generation

Select your current mood and let MoodMatch generate personalized content using AI.

- 💬 Inspirational Quotes
- 📝 Poems
- 📖 Short Stories
- ✍️ Captions
- 🎵 Song Suggestions

### 📚 Personalized Recommendations

MoodMatch provides recommendations based on the selected mood.

- 📖 **Books** — Retrieved using the Open Library API
- 📰 **Articles** — Generated and personalized using Gemini
- 🎬 **YouTube Videos** — Retrieved using the YouTube Data API

### 🤖 AI-Powered Experience

Google Gemini is used to understand the selected mood and generate personalized creative content and recommendations.

### 🎨 Interactive User Interface

- Clean and calming visual design
- Responsive layout
- Interactive hero section
- Smooth hover effects
- Scroll-based feature animations
- Personalized recommendation cards
- Mood-focused user experience

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- HTML5
- CSS3
- JavaScript

### Backend

- Python
- FastAPI
- Pydantic
- REST APIs

### AI & APIs

- Google Gemini API — AI-powered content generation
- YouTube Data API — mood-based video recommendations
- Open Library API — book recommendations and covers

### Deployment & Tools

- Vercel
- Git
- GitHub
- VS Code

---

🔮 Future Improvements
Some potential improvements for future versions include:
- 👤 User accounts and personalized profiles
- 💾 Mood history tracking
- 📊 Mood analytics dashboard
- ❤️ Save favorite recommendations
- 🤖 More advanced AI personalization
- 🎧 Spotify integration
- 📱 Mobile application
- 🔔 Personalized wellbeing reminders
- ⚡ Recommendation caching and rate limiting
- 🧠 Long-term mood pattern analysis

## 🏗️ Architecture

MoodMatch follows a frontend-backend architecture where the React application communicates with a FastAPI REST API.

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │    React + TypeScript     │
                    │         Frontend          │
                    │          Vite             │
                    └─────────────┬─────────────┘
                                  │
                                  │ REST API
                                  ▼
                    ┌───────────────────────────┐
                    │       FastAPI Backend      │
                    │          Python             │
                    └─────────────┬─────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
      │ Gemini API   │    │ YouTube API  │    │ Open Library │
      │              │    │              │    │     API      │
      └──────────────┘    └──────────────┘    └──────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                       ┌────────────────────┐
                       │ Personalized Mood │

                       │     Results        │
                       └────────────────────┘


