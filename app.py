import os
import re

import streamlit as st

from utils import query_gemini


def get_api_key():
    """Load the Gemini API key from Streamlit secrets or an environment variable."""
    try:
        api_key = st.secrets.get("api_key")
    except (FileNotFoundError, KeyError):
        api_key = None

    return api_key or os.getenv("GEMINI_API_KEY")


API = get_api_key()

def clean_html(raw_text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', raw_text)

# Page setup
st.set_page_config(page_title="MoodMatch", layout="centered")



# Custom styles with colored background
st.markdown(
    """
    <style>
        html, body {
            background-color: #f6f0fa;
            font-family: 'Georgia', serif;
        }
        .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }
        .title-text {
            font-size: 3em;
            text-align: center;
            margin-bottom: 0.5em;
            color: #FFFFFF;
        }
        .question-card, .output-card {
            background-color: #ffffff;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            margin-bottom: 20px;
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Title
st.markdown("<div class='title-text'>🧠 MOODMATCH 💗</div>", unsafe_allow_html=True)

# Question card
# st.markdown("<div class='question-card'>", unsafe_allow_html=True)

st.divider()

st.markdown("### What would you like MoodMatch to generate?")
content_type = st.radio("Select content type:", ["Quote", "Poem", "Story", "Caption","Song"])

st.markdown("### Answer a few questions to help us understand your emotional vibe")

q1 = st.selectbox("1. How was your day? 🌞", [
    "Tiring and dull", "Energetic and bright", "Full of worries", "Peaceful and relaxing", "Emotionally overwhelming","Chaotic and unpredictable","Mentally drained","Heartwarming and cheerful"
])
q2 = st.selectbox("2. What do you feel like doing right now?", [
    "Lying down and thinking", "Going for a walk or run", "Talking to a friend", "Journaling or reading", "Dancing or watching a movie","Listening to music alone","Browsing social media aimlessly"
])
q3 = st.selectbox("3. Pick the word that matches your vibe:🫶", [
    "Melancholy", "Inspired", "Restless", "Calm", "Excited","Frustrated","Vulnerable","Horny"
])

# st.markdown("</div>", unsafe_allow_html=True)  # End question card

# Generate response
if st.button("✨Generate response✨"):
    mood_summary = f"Day: {q1}. Current desire: {q2}. Emotional vibe: {q3}."
    prompt = f"Generate a {content_type.lower()} that reflects the following mood, without using HTML: {mood_summary}"
    with st.spinner("Loading the response",show_time=True):
        result = query_gemini(prompt,API)
        result = clean_html(result)


    # st.markdown("<div class='output-card'>", unsafe_allow_html=True)
    st.subheader(f"📝 Your {content_type}")
    st.markdown(
        f"""
        <div style='
            background-color: #fdfaf1;
            color: #333;
            padding: 20px;
            border-radius: 12px;
            font-size: 18px;
            font-family: Georgia, serif;
            line-height: 1.75;
            white-space: pre-wrap;
            '>{result}</div>
            """,
            unsafe_allow_html=True
    )
    # st.markdown("</div>", unsafe_allow_html=True)

