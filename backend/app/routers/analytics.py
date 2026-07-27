from fastapi import APIRouter
from app.firebase_config import database

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


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

    weather = database.child("weather").get() or {}
    occupancy = database.child("occupancy").get() or {}
    iaq = database.child("iaq").get() or {}
    comfort = database.child("comfort").get() or {}
    learning_quality = database.child("learning_quality").get() or {}
    energy = database.child("energy_recommendations").get() or {}
    cooling = database.child("cooling_demand").get() or {}
    alerts = database.child("alerts").get() or {}

    return {
        "weather": weather,
        "occupancy": occupancy,
        "iaq": iaq,
        "comfort": comfort,
        "learning_quality": learning_quality,
        "energy_recommendations": energy,
        "cooling_demand": cooling,
        "alerts": alerts
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