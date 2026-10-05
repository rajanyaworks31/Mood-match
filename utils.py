from google import genai


MODEL_NAME = "gemini-3.6-flash"


def query_gemini(prompt, GEMINI_API_KEY):
    """
    Send a text prompt to Gemini and return the generated text.

    The function keeps the existing query_gemini(prompt, API) interface so
    app.py does not need to change during this integration fix.
    """
    try:
        if not GEMINI_API_KEY:
            return "❌ Gemini API key is missing. Add 'api_key' to Streamlit secrets."

        client = genai.Client(api_key=GEMINI_API_KEY)
        interaction = client.interactions.create(
            model=MODEL_NAME,
            input=prompt,
        )

        if not interaction.output_text:
            return "❌ Gemini returned an empty response. Please try again."

        return interaction.output_text

    except Exception as e:
        return f"❌ Gemini API error: {str(e)}"
