from fastapi import APIRouter
from datetime import datetime
from app.firebase_config import database

router = APIRouter(prefix="/api", tags=["IAQ"])


@router.get("/iaq")
def calculate_iaq():

    # Read latest weather
    weather = database.child("weather").get()

    # Read latest occupancy
    occupancy = database.child("occupancy").get()

    # If get() returns None
    if weather is None:
        weather = {}

    if occupancy is None:
        occupancy = {}

    temperature = weather.get("temperature", 25)
    humidity = weather.get("humidity", 50)
    people_count = occupancy.get("people_count", 0)

    # ---------- IAQ Calculation ----------
    score = 100

    # Occupancy penalty
    score -= people_count * 1.2

    # Temperature penalty
    if temperature > 26:
        score -= (temperature - 26) * 2

    # Humidity penalty
    if humidity > 60:
        score -= (humidity - 60) * 0.5

    score = max(0, min(100, round(score)))

    # IAQ Status
    if score >= 80:
        status = "Excellent"
    elif score >= 60:
        status = "Good"
    elif score >= 40:
        status = "Moderate"
    elif score >= 20:
        status = "Poor"
    else:
        status = "Very Poor"

    iaq_data = {
        "score": score,
        "status": status,
        "temperature": temperature,
        "humidity": humidity,
        "people_count": people_count,
        "timestamp": datetime.now().isoformat()
    }

    # Store in Firebase
    database.child("iaq").set(iaq_data)

    return iaq_data