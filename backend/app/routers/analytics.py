from fastapi import APIRouter

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)
from app.firebase_config import database

@router.get("/weather")
def get_weather_history():
    data = database.child("weather_history").get()

    if not data:
        return {
            "message": "No historical weather data found."
        }

    return data
@router.get("/dashboard")
def dashboard_summary():
    weather = database.child("weather").get()
    occupancy = database.child("occupancy").get()

    return {
        "weather": weather,
        "occupancy": occupancy
    }
@router.get("/weather/average")
def average_temperature():
    history = database.child("weather_history").get()

    if not history:
        return {
            "message": "No historical weather data found."
        }

    temperatures = []

    for record in history.values():
        temperatures.append(record["temperature"])

    average = sum(temperatures) / len(temperatures)

    return {
        "total_records": len(temperatures),
        "average_temperature": round(average, 2)
    }