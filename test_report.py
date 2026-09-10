import requests

BASE_URL = "https://pashuraksha-pearl.vercel.app"

# 1. Get token
auth_response = requests.post(
    f"{BASE_URL}/api/auth/dev-token",
    json={
        "role": "farmer"
    }
)

print("Auth status:", auth_response.status_code)
print("Auth response:", auth_response.text)

token = auth_response.json()["token"]

# 2. Submit report
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

payload = {
    "animal_type": "cow",
    "symptoms": [
        "mouth_blisters",
        "salivation",
        "fever",
        "lameness"
    ],
    "district": "Pune"
}

response = requests.post(
    f"{BASE_URL}/api/reports",
    json=payload,
    headers=headers
)

print("Report status:", response.status_code)
print("Report response:", response.text)