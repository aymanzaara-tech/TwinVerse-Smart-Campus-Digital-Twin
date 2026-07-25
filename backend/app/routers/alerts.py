from fastapi import APIRouter
from datetime import datetime
from app.firebase_config import database

router = APIRouter(
    prefix="/api",
    tags=["Alerts"]
)


@router.get("/alerts")
def get_alerts():

    iaq = database.child("iaq").get() or {}
    comfort = database.child("comfort").get() or {}
    learning = database.child("learning_quality").get() or {}
    cooling = database.child("cooling_demand").get() or {}
    occupancy = database.child("occupancy").get() or {}

    alerts = []

    iaq_score = iaq.get("score", 100)
    comfort_score = comfort.get("comfort_score", 100)
    learning_score = learning.get("learning_quality_index", 100)
    cooling_demand = cooling.get("cooling_demand", "Low")
    people_count = occupancy.get("people_count", 0)

    # IAQ
    if iaq_score < 60:
        alerts.append("Poor Indoor Air Quality. Improve ventilation.")

    # Comfort
    if comfort_score < 70:
        alerts.append("Comfort Score is low. Review room conditions.")

    # Learning Quality
    if learning_score < 70:
        alerts.append("Learning Quality is below the desired level.")

    # Cooling
    if cooling_demand == "High":
        alerts.append("High Cooling Demand predicted.")

    # Occupancy
    if people_count > 80:
        alerts.append("Room occupancy is nearing maximum capacity.")

    # Everything Normal
    if len(alerts) == 0:
        alerts.append("No active alerts. Room conditions are satisfactory.")

    alert_data = {
        "alert_count": len(alerts),
        "alerts": alerts,
        "timestamp": datetime.now().isoformat()
    }

    database.child("alerts").set(alert_data)

    return alert_data