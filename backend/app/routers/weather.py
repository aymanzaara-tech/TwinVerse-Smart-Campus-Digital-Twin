from app.firebase_config import database
from fastapi import APIRouter
import requests

router = APIRouter()


@router.get("/weather")
def get_weather():
    latitude = 13.0827
    longitude = 77.5685

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}"
        f"&current=temperature_2m,relative_humidity_2m"
    )

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        print("Status Code:", response.status_code)
        print("Response:", response.text)

        data = response.json()
        database.child("weather").set({
    "temperature": data["current"]["temperature_2m"],
    "humidity": data["current"]["relative_humidity_2m"]
})

        return {
            "temperature": data["current"]["temperature_2m"],
            "humidity": data["current"]["relative_humidity_2m"],
        }

    except Exception as e:
        return {"error": str(e)}