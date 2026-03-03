import urllib.request
import urllib.error

url = 'http://127.0.0.1:8000/api/v1/documents/8a098f47-8b12-4794-a24f-5f8b8b25931e/export'
try:
    with urllib.request.urlopen(url) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
    print(e.read().decode())
except Exception as e:
    print(f"Other Error: {e}")
