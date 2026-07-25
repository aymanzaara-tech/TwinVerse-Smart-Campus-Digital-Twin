from fastapi import APIRouter
from datetime import datetime
from app.firebase_config import database

router = APIRouter(
    prefix="/api",
    tags=["Comfort Score"]
)

# Maximum seating capacity of the seminar hall
MAX_CAPACITY = 100


# ----------------------------
# Temperature Score
# ----------------------------
def get_temperature_score(temp):
    if 22 <= temp <= 26:
        return 100
    elif temp <= 28:
        return 85
    elif temp <= 30:
        return 70
    elif temp <= 32:
        return 50
    else:
        return 30


# ----------------------------
# Humidity Score
# ----------------------------
def get_humidity_score(humidity):
    if 40 <= humidity <= 60:
        return 100
    elif humidity <= 70:
        return 80
    elif humidity <= 80:
        return 60
    else:
        return 40


# ----------------------------
# Occupancy Score
# ----------------------------
def get_occupancy_score(people_count):
    score = 100 - ((people_count / MAX_CAPACITY) * 100)
    return max(0, round(score))


# ----------------------------
# Comfort Score API
# ----------------------------
@router.get("/comfort")
def get_comfort():

    # Read latest weather data
    weather = database.child("weather").get() or {}

    # Read latest occupancy data
    occupancy = database.child("occupancy").get() or {}

    # Read latest IAQ data
    iaq = database.child("iaq").get() or {}

    # Extract values
    temperature = weather.get("temperature", 25)
    humidity = weather.get("humidity", 50)
    people_count = occupancy.get("people_count", 0)
    iaq_score = iaq.get("score", 50)

    # Calculate individual scores
    temperature_score = get_temperature_score(temperature)
    humidity_score = get_humidity_score(humidity)
    occupancy_score = get_occupancy_score(people_count)

    # Final Comfort Score
    comfort_score = round(
        (iaq_score * 0.40) +
        (temperature_score * 0.25) +
        (humidity_score * 0.20) +
        (occupancy_score * 0.15)
    )

    # Comfort Status
    if comfort_score >= 90:
        status = "Excellent"
    elif comfort_score >= 75:
        status = "Comfortable"
    elif comfort_score >= 60:
        status = "Moderate"
    elif comfort_score >= 40:
        status = "Poor"
    else:
        status = "Very Poor"

    # Create response
    comfort_data = {
        "comfort_score": comfort_score,
        "status": status,
        "temperature": temperature,
        "humidity": humidity,
        "people_count": people_count,
        "iaq_score": iaq_score,
        "temperature_score": temperature_score,
        "humidity_score": humidity_score,
        "occupancy_score": occupancy_score,
        "timestamp": datetime.now().isoformat()
    }

    # Store in Firebase
    database.child("comfort").set(comfort_data)

    # Return response
    return comfort_data