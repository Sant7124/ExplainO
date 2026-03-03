import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = f"https://api-inference.huggingface.co/pipeline/text-generation/{os.getenv('HF_MODEL')}"
headers = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}

payload = {
    "inputs": "Explain phishing email in one simple sentence"
}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	print(f"Status Code: {response.status_code}")
	return response.json()

output = query(payload)
print(output)
