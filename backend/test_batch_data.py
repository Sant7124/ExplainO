import requests
import time
import json
import os

BASE_URL = "http://127.0.0.1:8000/api/v1"
TEST_DATA_DIR = r"c:\Users\sant7\OneDrive\Desktop\ExplainO\TestData"

files_to_test = [
    {"name": "ATS_Resume.jpeg", "question": "What are the key skills and experience mentioned in this resume?"},
    {"name": "Cardio-Sample-Report.pdf", "question": "What are the main findings or diagnosis in this cardio report?"},
    {"name": "G_CS FreeResourcs .pdf", "question": "What is the main topic of these computer science resources?"},
    {"name": "Program_Info.jpeg", "question": "Summarize the program information shown in this image."}
]

def run_batch_test():
    print(f"=== Starting Batch Stress Test for ExplainO RAG Backend ===")
    
    for test in files_to_test:
        filename = test["name"]
        question = test["question"]
        file_path = os.path.join(TEST_DATA_DIR, filename)
        
        if not os.path.exists(file_path):
            print(f"Skipping {filename}: File not found.")
            continue
            
        print(f"\n>>> Testing File: {filename}")
        
        # 1. Upload
        with open(file_path, "rb") as f:
            mime_type = "image/jpeg" if filename.lower().endswith(".jpeg") else "application/pdf"
            files = {"file": (filename, f, mime_type)}
            upload_resp = requests.post(f"{BASE_URL}/upload", files=files)
            
        if upload_resp.status_code != 200:
            print(f"   [FAIL] Upload failed: {upload_resp.text}")
            continue
            
        doc_id = upload_resp.json()["document_id"]
        print(f"   [OK] Uploaded. Doc ID: {doc_id}")
        
        # 2. Poll Status
        ready = False
        for attempt in range(20):
            status_resp = requests.get(f"{BASE_URL}/documents/{doc_id}")
            if status_resp.status_code != 200:
                print(f"   [ERROR] Could not fetch status: {status_resp.text}")
                break
                
            status_data = status_resp.json()
            status = status_data["status"]
            print(f"      Attempt {attempt+1}: Status = {status}")
            
            if status == "ready":
                ready = True
                break
            elif status == "failed":
                print(f"   [FAIL] Processing failed: {status_data.get('error_message')}")
                break
            time.sleep(3)
            
        if not ready:
            print(f"   [TIMEOUT] Document {doc_id} never reached ready state.")
            continue
            
        # 3. Chat/Query
        print(f"   [QUERY] Asking: '{question}'")
        chat_payload = {"question": question}
        chat_resp = requests.post(f"{BASE_URL}/chat/{doc_id}", json=chat_payload)
        
        if chat_resp.status_code == 200:
            result = chat_resp.json()
            print(f"   [SUCCESS] AI Answer: {result['answer'][:200]}...")
            if result.get("sources"):
                print(f"   [CITATIONS] Found {len(result['sources'])} sources.")
        else:
            print(f"   [FAIL] Chat failed: {chat_resp.text}")

    print("\n=== Batch Stress Test Completed ===")

if __name__ == "__main__":
    run_batch_test()
