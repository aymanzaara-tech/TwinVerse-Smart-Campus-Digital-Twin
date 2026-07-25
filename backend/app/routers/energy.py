from fastapi import APIRouter
from app.firebase_config import database
from datetime import datetime
router = APIRouter(
    prefix="/api",
    tags=["Smart Energy"]
)
@router.get("/energy")
@router.get("/energy")

@router.get("/energy")
def get_energy_recommendations():

    # Read latest Weather
    weather = database.child("weather").get() or {}

    # Read latest Occupancy
    occupancy = database.child("occupancy").get() or {}

    # Read latest IAQ
    iaq = database.child("iaq").get() or {}

    # Read latest Comfort Score
    comfort = database.child("comfort").get() or {}

    # Extract values
    temperature = weather.get("temperature", 25)
    humidity = weather.get("humidity", 50)
    people_count = occupancy.get("people_count", 0)
    iaq_score = iaq.get("score", 50)
    comfort_score = comfort.get("comfort_score", 50)

    recommendations = []

    # Temperature
    if temperature > 30:
        recommendations.append(
            "Cooling is recommended due to high outdoor temperature."
        )

    # Humidity
    if humidity > 70:
        recommendations.append(
            "Increase ventilation to reduce humidity."
        )

    # IAQ
    if iaq_score < 60:
        recommendations.append(
            "Indoor air quality is poor. Improve ventilation."
        )

    # Occupancy
    if people_count > 80:
        recommendations.append(
            "Room occupancy is high. Consider reducing occupancy."
        )

    # Comfort
    if comfort_score < 70:
        recommendations.append(
            "Room comfort is below the desired level."
        )

    # Everything Normal
    if len(recommendations) == 0:
        recommendations.append(
            "Room conditions are optimal. Maintain current settings."
        )

    energy_data = {
        "temperature": temperature,
        "humidity": humidity,
        "people_count": people_count,
        "iaq_score": iaq_score,
        "comfort_score": comfort_score,
        "recommendations": recommendations,
        "timestamp": datetime.now().isoformat()
    }

    # Store in Firebase
    database.child("energy_recommendations").set(energy_data)

    return energy_data