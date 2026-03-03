import requests

try:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2:1b",
            "prompt": "Explain phishing in one line",
            "stream": False
        },
        timeout=120
    )

    print(response.json()["response"])
except Exception as e:
    print(f"Ollama Connection Error: {e}")
    print("Ensure Ollama is running and 'llama3.2:1b' is pulled.")
