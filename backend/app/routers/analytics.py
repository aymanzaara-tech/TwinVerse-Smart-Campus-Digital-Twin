from fastapi import APIRouter
from app.firebase_config import database
from app.services.prediction_service import generate_prediction

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

    prediction = generate_prediction(weather, occupancy)

    return prediction


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


@router.get("/history")
def get_prediction_history():

    history = database.child("prediction_history").get()

    if not history:
        return {
            "message": "No prediction history found."
        }

    return history