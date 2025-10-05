import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, url, data=None, headers=None):
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        else:
            print(f"Unsupported method: {method}")
            return

        print(f"\n{method} {url}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            try:
                print(f"Response: {response.json()}")
            except:
                print(f"Response: {response.text}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error testing {method} {url}: {e}")

# Test all endpoints
print("Testing CareerMentor AI Backend API...")

# Root endpoint
test_endpoint("GET", f"{BASE_URL}/")

# Demo endpoint
test_endpoint("GET", f"{BASE_URL}/demo")

# Chat endpoint - valid request
test_endpoint("POST", f"{BASE_URL}/chat", {"message": "Hello, I need career advice"})

# Chat endpoint - invalid request (empty message)
test_endpoint("POST", f"{BASE_URL}/chat", {"message": ""})

# Interview generate endpoint - valid request
test_endpoint("POST", f"{BASE_URL}/interview/generate", {"role": "Software Engineer", "difficulty": "medium"})

# Interview generate endpoint - invalid request (missing role)
test_endpoint("POST", f"{BASE_URL}/interview/generate", {"difficulty": "medium"})

# Interview feedback endpoint - valid request
test_endpoint("POST", f"{BASE_URL}/interview/feedback", {
    "question": "Tell me about yourself",
    "answer": "I am a software engineer with 3 years of experience..."
})

# Interview feedback endpoint - invalid request (missing question)
test_endpoint("POST", f"{BASE_URL}/interview/feedback", {
    "answer": "I am a software engineer..."
})

print("\nAPI testing completed!")
