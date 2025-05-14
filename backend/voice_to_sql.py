import os
import speech_recognition as sr
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

genai.configure(api_key=API_KEY)

def capture_speech() -> str:
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print("🎤 Speak Now...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        print("🛑 Processing...")

    try:
        text = recognizer.recognize_google(audio)
        print(f"✅ Recognized: {text}")
        return text
    except sr.UnknownValueError:
        print("❌ Speech was not understood.")
        return "Sorry, I could not understand the speech."
    except sr.RequestError as e:
        print(f"❌ Google API error: {e}")
        return "Speech recognition service is unavailable."
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return "An error occurred during speech recognition."

def generate_sql(user_prompt: str) -> str:
    if not user_prompt or not user_prompt.strip():
        return "Error: Empty prompt provided."

    prompt = f"SELECT query for table uploaded_data: {user_prompt}"


    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)

        if response and response.text:
            return clean_sql_query(response.text)
        else:
            return "Error: No content returned from Gemini."
    except Exception as e:
        print("❌ Error from Gemini:", e)
        return f"Error generating SQL: {str(e)}"

def clean_sql_query(sql_query: str) -> str:
    cleaned = sql_query.strip()
    if cleaned.startswith("sql"):
         cleaned = cleaned[len("sql"):].strip()
    if cleaned.endswith(""):
         cleaned = cleaned[:-len("")].strip()
    cleaned = cleaned.replace("```", "").strip()
    return cleaned