from fastapi import APIRouter
from app.firebase_config import database
from datetime import datetime
router = APIRouter(
    prefix="/api",
    tags=["Learning Quality"]
)
MAX_CAPACITY = 100

def get_occupancy_score(people_count):
    score = 100 - ((people_count / MAX_CAPACITY) * 100)
    return max(0, round(score))

from datetime import datetime


@router.get("/learning-quality")
def get_learning_quality():

    # Read latest Comfort Score
    comfort = database.child("comfort").get() or {}

    # Read latest IAQ
    iaq = database.child("iaq").get() or {}

    # Read latest Occupancy
    occupancy = database.child("occupancy").get() or {}

    # Extract values
    comfort_score = comfort.get("comfort_score", 50)
    iaq_score = iaq.get("score", 50)
    people_count = occupancy.get("people_count", 0)

    occupancy_score = get_occupancy_score(people_count)

    # Learning Quality Index
    learning_quality = round(
        (comfort_score * 0.50) +
        (iaq_score * 0.30) +
        (occupancy_score * 0.20)
    )

    # Status
    if learning_quality >= 90:
        status = "Excellent"
    elif learning_quality >= 75:
        status = "Good"
    elif learning_quality >= 60:
        status = "Average"
    elif learning_quality >= 40:
        status = "Poor"
    else:
        status = "Very Poor"

    learning_quality_data = {
        "learning_quality_index": learning_quality,
        "status": status,
        "comfort_score": comfort_score,
        "iaq_score": iaq_score,
        "people_count": people_count,
        "occupancy_score": occupancy_score,
        "timestamp": datetime.now().isoformat()
    }

    # Store in Firebase
    database.child("learning_quality").set(learning_quality_data)

    return learning_quality_data