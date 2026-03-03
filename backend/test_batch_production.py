import requests
import os
import time
import json

BASE_URL = "http://localhost:8000/api/v1"
TEST_DATA_DIR = r"c:\Users\sant7\OneDrive\Desktop\ExplainO\TestData"

def test_batch():
    results = []
    files = [f for f in os.listdir(TEST_DATA_DIR) if os.path.isfile(os.path.join(TEST_DATA_DIR, f))]
    
    print(f"Starting Batch Test on {len(files)} files...")
    
    for filename in files:
        file_path = os.path.join(TEST_DATA_DIR, filename)
        print(f"\n[TESTING] {filename}")
        
        # 1. Upload
        with open(file_path, "rb") as f:
            res = requests.post(f"{BASE_URL}/upload", files={"file": (filename, f)})
        
        if res.status_code != 200:
            print(f"   Upload Failed: {res.text}")
            results.append({"file": filename, "status": "Upload Failed"})
            continue
            
        doc_id = res.json()["document_id"]
        print(f"   Uploaded. ID: {doc_id}. Waiting for processing...")
        
        # 2. Poll for Ready
        is_ready = False
        for _ in range(30):
            status_res = requests.get(f"{BASE_URL}/documents/{doc_id}")
            doc = status_res.json()
            if doc["status"] == "ready":
                is_ready = True
                print("   Ready!")
                break
            elif doc["status"] == "failed":
                print(f"   Processing Failed: {doc.get('error_message')}")
                break
            time.sleep(3)
        
        if not is_ready:
            results.append({"file": filename, "status": "Processing Timeout"})
            continue
            
        # 3. Check Summary
        doc_data = requests.get(f"{BASE_URL}/documents/{doc_id}").json()
        summary_ok = doc_data.get("explanation") is not None
        print(f"   Summary Generation: {'SUCCESS' if summary_ok else 'FAILED'}")
        
        # 4. Test Chat (1 Query)
        chat_res = requests.post(f"{BASE_URL}/chat/{doc_id}", json={"question": "Summarize this in 10 words."})
        chat_ok = chat_res.status_code == 200
        print(f"   Chat Test: {'SUCCESS' if chat_ok else 'FAILED'}")
        
        results.append({
            "file": filename,
            "id": doc_id,
            "status": "PASS" if (summary_ok and chat_ok) else "FAIL",
            "explanation": doc_data.get("explanation")[:100] + "..." if summary_ok else "N/A"
        })

    print("\n" + "="*50)
    print("FINAL BATCH RESULTS")
    print("="*50)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_batch()
