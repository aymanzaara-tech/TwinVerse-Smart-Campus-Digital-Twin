import requests
from datetime import datetime
from app.firebase_config import database


def fetch_weather():
    latitude = 13.1575
    longitude = 77.5608

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}"
        f"&current=temperature_2m,relative_humidity_2m"
    )

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()

    weather_data = {
        "temperature": data["current"]["temperature_2m"],
        "humidity": data["current"]["relative_humidity_2m"],
    }
    database.child("weather").set(weather_data)
    history_data = {
    **weather_data,
    "timestamp": datetime.now().isoformat()
    }

    database.child("weather_history").push(history_data)
    return weather_data
def get_latest_weather():
    data = database.child("weather").get()

    if data:
        return data

    return {
        "message": "No weather data found."
    }