import requests
from app.firebase_config import database


def fetch_weather():
    latitude = 13.0827
    longitude = 77.5685

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

    return weather_data
def get_latest_weather():
    data = database.child("weather").get()

    if data:
        return data

    return {
        "message": "No weather data found."
    }