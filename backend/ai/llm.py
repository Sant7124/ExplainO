import os
import requests
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ------------------- CONFIG -------------------
GROQ_MODEL = os.getenv("GROQ_MODEL")
HF_MODEL = os.getenv("HF_MODEL")
HF_API_KEY = os.getenv("HF_API_KEY")
HF_API_URL = os.getenv("HF_API_URL")

# Clients
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
hf_headers = {"Authorization": f"Bearer {HF_API_KEY}"}

DEFAULT_TIMEOUT = 30 # Seconds

# ------------------- PROVIDERS -------------------

def ask_groq(prompt: str):
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            timeout=DEFAULT_TIMEOUT
        )
        return response.choices[0].message.content
    except Exception as e:
        from services.logger import log_event
        log_event("GroqProvider", f"Groq request failed: {e}", level="ERROR")
        return None


def ask_huggingface(prompt: str):
    try:
        response = requests.post(
            f"{HF_API_URL}/{HF_MODEL}",
            headers=hf_headers,
            json={"inputs": prompt},
            timeout=DEFAULT_TIMEOUT
        )
        # Handle list response from inference API
        res_json = response.json()
        if isinstance(res_json, list) and len(res_json) > 0:
            return res_json[0].get("generated_text")
        return res_json.get("generated_text")
    except Exception as e:
        from services.logger import log_event
        log_event("HFProvider", f"HuggingFace request failed: {e}", level="ERROR")
        return None


def ask_ollama(prompt: str):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2:1b",
                "prompt": prompt,
                "stream": False
            },
            timeout=DEFAULT_TIMEOUT
        )
        return response.json()["response"]
    except Exception as e:
        from services.logger import log_event
        log_event("OllamaProvider", f"Ollama request failed: {e}", level="ERROR")
        return None


# ------------------- MASTER FUNCTION -------------------

def ask_llm(prompt: str):
    # 1️⃣ Try Groq
    result = ask_groq(prompt)
    if result:
        return result

    # 2️⃣ Try HuggingFace
    result = ask_huggingface(prompt)
    if result:
        return result

    # 3️⃣ Try Ollama
    result = ask_ollama(prompt)
    if result:
        return result

    return "All AI providers are currently unavailable."
