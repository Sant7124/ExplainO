import requests
import time
import os

BASE_URL = "http://localhost:8000/api/v1"

def wait_for_server():
    print("Waiting for server health...")
    for _ in range(30):
        try:
            res = requests.get("http://localhost:8000/health")
            if res.status_code == 200:
                print("Server is healthy!")
                return True
        except:
            pass
        time.sleep(2)
    return False

def test_full_integration():
    if not wait_for_server():
        print("Server timed out.")
        return
    print("=== ExplainO Integration Verification ===")
    
    # 1. Test Text Analysis (Direct Paste)
    print("\n[STEP 1] Testing Direct Text Analysis...")
    text_data = "ExplainO is an AI document assistant. It was built by a team of experts to simplify complex files. The main goal is 100% operational SaaS readiness."
    files = {'file': ('direct_input.txt', text_data, 'text/plain')}
    
    upload_res = requests.post(f"{BASE_URL}/upload", files=files)
    if upload_res.status_code != 200:
        print(f"   ERROR: Upload failed with status {upload_res.status_code}")
        print(f"   RESPONSE: {upload_res.text}")
        return
        
    try:
        data = upload_res.json()
        doc_id = data['document_id']
        print(f"   Uploaded. Doc ID: {doc_id}")
    except Exception as e:
        print(f"   ERROR: Failed to parse upload response: {e}")
        print(f"   RESPONSE: {upload_res.text}")
        return
    
    # 2. Poll for Summary
    print("\n[STEP 2] Waiting for Summary Generation...")
    max_retries = 30
    for i in range(max_retries):
        status_res = requests.get(f"{BASE_URL}/documents/{doc_id}")
        doc = status_res.json()
        if doc['status'] == 'ready':
            print("   SUCCESS: Document is ready.")
            print(f"   EXPLANATION: {doc['explanation']}")
            print(f"   POINTS: {doc['points_json']}")

            # 2. Check Summary & Sub-status
            doc_data = requests.get(f"{BASE_URL}/documents/{doc_id}").json()
            print(f"   Final Sub-status: {doc_data.get('sub_status')}")
            summary_ok = doc_data.get("explanation") is not None
            print(f"   Summary Generation: {'SUCCESS' if summary_ok else 'FAILED'}")
            
            # 3. Test PDF Export
            print("   Testing PDF Export...")
            export_res = requests.get(f"{BASE_URL}/documents/{doc_id}/export")
            if export_res.status_code == 200 and export_res.headers.get("Content-Type") == "application/pdf":
                print("   PDF Export: SUCCESS")
            else:
                print(f"   PDF Export: FAILED ({export_res.status_code})")

            # 4. Test Rate Limiting (Upload 6 times)
            print("   Testing Rate Limiting (5/hour)...")
            limited = False
            # Create a dummy file for rate limit testing
            temp_file_path = "temp_rate_limit_test.txt"
            with open(temp_file_path, "w") as f:
                f.write("This is a dummy file for rate limit testing.")
            
            for j in range(10): # Use j to avoid conflict with i
                with open(temp_file_path, "rb") as f:
                    r = requests.post(f"{BASE_URL}/upload", files={"file": ("rate_limit_test.txt", f)})
                    if r.status_code == 429:
                        print(f"   Rate Limit Triggered at request {j+1}: SUCCESS")
                        limited = True
                        break
            if not limited:
                print("   Rate Limit: FAILED (Not triggered)")
            
            # Clean up dummy file
            os.remove(temp_file_path)

            break
        elif doc['status'] == 'failed':
            print(f"   FAILED: {doc['error_message']}")
            return
        time.sleep(2)
        print(f"   Retry {i+1}...")
    
    # 3. Test Chat Limit (10 Queries)
    print("\n[STEP 3] Testing 10-Query Chat Limit...")
    for q in range(1, 12):
        res = requests.post(f"{BASE_URL}/chat/{doc_id}", json={"question": f"Question {q}"})
        if res.status_code == 200:
            print(f"   Query {q}: OK (Count: {res.json().get('question_count')})")
        elif res.status_code == 429:
            print(f"   Query {q}: BLOCKED (Limit reached). Correct.")
            break
        else:
            print(f"   Query {q}: ERROR ({res.status_code})")
            break

if __name__ == "__main__":
    test_full_integration()
