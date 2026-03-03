import requests
import time
import json
import os

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_rag_pipeline():
    # 1. Upload Document
    file_path = "test_sample.pdf"
    print(f"--- Step 1: Uploading {file_path} ---")
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, "application/pdf")}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    if response.status_code != 200:
        print(f"Upload failed: {response.text}")
        return

    data = response.json()
    doc_id = data["document_id"]
    print(f"Upload Success! Document ID: {doc_id}")

    # 2. Poll Status
    print(f"--- Step 2: Polling status for {doc_id} ---")
    max_retries = 30
    ready = False
    for i in range(max_retries):
        status_resp = requests.get(f"{BASE_URL}/documents/{doc_id}")
        status_data = status_resp.json()
        status = status_data["status"]
        print(f"Retry {i+1}: Status = {status}")
        
        if status == "ready":
            ready = True
            break
        elif status == "failed":
            print(f"Processing failed: {status_data.get('error_message')}")
            return
        
        time.sleep(2)

    if not ready:
        print("Timeout waiting for document to be ready.")
        return

    # 3. Chat with Document
    print(f"--- Step 3: Chatting with {doc_id} ---")
    chat_payload = {
        "question": "What is the encryption standard mentioned in the security protocol and what is the similarity threshold?"
    }
    chat_resp = requests.post(f"{BASE_URL}/chat/{doc_id}", json=chat_payload)
    
    if chat_resp.status_code == 200:
        print("Chat Success!")
        print(json.dumps(chat_resp.json(), indent=2))
    else:
        print(f"Chat failed: {chat_resp.text}")

if __name__ == "__main__":
    test_rag_pipeline()
