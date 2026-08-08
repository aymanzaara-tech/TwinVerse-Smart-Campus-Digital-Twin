def generate_recommendations(predictions):

    recommendations = []
    alerts = []

    indoor_temp = predictions["indoor_temperature"]
    indoor_humidity = predictions["indoor_humidity"]
    comfort = predictions["comfort_score"]
    learning = predictions["learning_quality"]
    cooling = predictions["cooling_demand"]

    # ==========================
    # Cooling Recommendations
    # ==========================

    if cooling >= 75:
        recommendations.append(
            "High cooling demand detected. Increase AC cooling."
        )

    elif cooling >= 50:
        recommendations.append(
            "Moderate cooling demand. Maintain current cooling."
        )

    else:
        recommendations.append(
            "Cooling demand is low. Energy saving mode recommended."
        )

    # ==========================
    # Temperature
    # ==========================

    if indoor_temp >= 30:
        alerts.append(
            "Indoor temperature is high."
        )

    elif indoor_temp <= 20:
        alerts.append(
            "Indoor temperature is low."
        )

    # ==========================
    # Humidity
    # ==========================

    if indoor_humidity >= 70:
        alerts.append(
            "Indoor humidity is high."
        )

    elif indoor_humidity <= 30:
        alerts.append(
            "Indoor humidity is low."
        )

    # ==========================
    # Comfort
    # ==========================

    if comfort < 60:
        alerts.append(
            "Comfort score is poor."
        )

    # ==========================
    # Learning Quality
    # ==========================

    if learning < 60:
        alerts.append(
            "Learning quality may be affected."
        )

    # ==========================
    # Default
    # ==========================

    if len(alerts) == 0:
        alerts.append(
            "Room conditions are satisfactory."
        )

    return {
        "recommendations": recommendations,
        "alerts": alerts
    }