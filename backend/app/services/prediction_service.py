from datetime import datetime

from app.firebase_config import database
from app.services.ml_predictor import predict
from app.services.recommendation_service import generate_recommendations
from app.services.analytics import (
    high_occupancy_alert,
    temperature_trend,
    get_alert_severity,
    MAX_CAPACITY
)


def generate_prediction(weather, occupancy):
    """
    Generate ML predictions,
    generate recommendations,
    generate AI Analytics,
    save everything to Firebase,
    return prediction.
    """

    now = datetime.now()

    hour = now.hour
    day_of_week = now.weekday()
    is_weekend = 1 if day_of_week >= 5 else 0

    outdoor_temperature = weather.get("temperature", 25)
    outdoor_humidity = weather.get("humidity", 60)

    people = occupancy.get("people_count", 0)

    cache = database.child("prediction_cache").get() or {}

    same_input = (
        cache.get("outdoor_temperature") == outdoor_temperature
        and cache.get("outdoor_humidity") == outdoor_humidity
        and cache.get("occupancy") == people
    )

    # -----------------------------------------
    # Use cached prediction ONLY if it already
    # contains ai_analytics
    # -----------------------------------------

    if same_input:
        latest = database.child("latest_prediction").get()

        if latest and "ai_analytics" in latest:
            return latest

    # -----------------------------------------
    # ML Prediction
    # -----------------------------------------

    predictions = predict(
        hour=hour,
        day_of_week=day_of_week,
        is_weekend=is_weekend,
        outdoor_temperature=outdoor_temperature,
        outdoor_humidity=outdoor_humidity,
        occupancy=people,
    )

    # -----------------------------------------
    # Recommendations
    # -----------------------------------------

    recommendations = generate_recommendations(predictions)

    # -----------------------------------------
    # AI Analytics
    # -----------------------------------------

    weather_history = database.child("weather_history").get() or {}

    occupancy_density = (people / MAX_CAPACITY) * 100

    occupancy_status = high_occupancy_alert(
        occupancy_density
    )

    previous_temp, current_temp, trend = temperature_trend(
        weather_history
    )

    severity = get_alert_severity(predictions)

    # -----------------------------------------
    # Final Response
    # -----------------------------------------

    prediction_data = {

        "timestamp": now.isoformat(),

        "weather": weather,

        "occupancy": occupancy,

        "predictions": {
            "indoor_temperature": round(predictions["indoor_temperature"], 2),
            "indoor_humidity": round(predictions["indoor_humidity"], 2),
            "comfort_score": round(predictions["comfort_score"], 2),
            "learning_quality": round(predictions["learning_quality"], 2),
            "cooling_demand": round(predictions["cooling_demand"], 2)
        },

        "energy_recommendations": recommendations["recommendations"],

        "alerts": recommendations["alerts"],

        "ai_analytics": {

            "occupancy": {
                "occupancy_density": round(occupancy_density, 2),
                "status": occupancy_status
            },

            "temperature_trend": {
                "previous_temperature": previous_temp,
                "current_temperature": current_temp,
                "trend": trend
            },

            "alert": {
                "severity": severity
            }

        }

    }

    # -----------------------------------------
    # Save Latest Prediction
    # -----------------------------------------

    database.child("latest_prediction").set(
        prediction_data
    )

    # -----------------------------------------
    # Save Prediction History
    # -----------------------------------------

    database.child("prediction_history").push(
        prediction_data
    )

    # -----------------------------------------
    # Update Cache
    # -----------------------------------------

    database.child("prediction_cache").set({
        "outdoor_temperature": outdoor_temperature,
        "outdoor_humidity": outdoor_humidity,
        "occupancy": people
    })

    return prediction_data