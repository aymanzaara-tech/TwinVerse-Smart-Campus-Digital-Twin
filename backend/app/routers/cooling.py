from fastapi import APIRouter
from datetime import datetime
from app.firebase_config import database

router = APIRouter(
    prefix="/api",
    tags=["Cooling Demand"]
)


@router.get("/cooling")
def get_cooling():

    # Read latest Weather
    weather = database.child("weather").get() or {}

    # Read latest Occupancy
    occupancy = database.child("occupancy").get() or {}

    # Read latest Comfort Score
    comfort = database.child("comfort").get() or {}

    # Extract values
    temperature = weather.get("temperature", 25)
    humidity = weather.get("humidity", 50)
    people_count = occupancy.get("people_count", 0)
    comfort_score = comfort.get("comfort_score", 50)

    # Cooling Demand Logic
    if temperature > 32 and people_count > 60:
        demand = "High"

    elif temperature >= 28 and people_count > 40:
        demand = "Moderate"

    else:
        demand = "Low"

    # Increase demand if comfort is poor
    if comfort_score < 70:
        if demand == "Low":
            demand = "Moderate"
        elif demand == "Moderate":
            demand = "High"

    cooling_data = {
        "cooling_demand": demand,
        "temperature": temperature,
        "humidity": humidity,
        "people_count": people_count,
        "comfort_score": comfort_score,
        "timestamp": datetime.now().isoformat()
    }

    # Store in Firebase
    database.child("cooling_demand").set(cooling_data)

    return cooling_data