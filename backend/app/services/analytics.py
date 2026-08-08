# ---------------------------------
# TwinVerse AI Analytics Module
# ---------------------------------

HIGH_OCCUPANCY_THRESHOLD = 80
MAX_CAPACITY = 100


# -----------------------------
# Occupancy Analytics
# -----------------------------

def high_occupancy_alert(occupancy_density):
    """
    Generates alert based on occupancy percentage.
    """

    if occupancy_density >= HIGH_OCCUPANCY_THRESHOLD:
        return "🚨 High Occupancy Alert"

    return "✅ Occupancy Normal"


# -----------------------------
# Temperature Trend
# -----------------------------

def temperature_trend(weather_history):
    """
    Determines outdoor temperature trend.
    """

    if len(weather_history) < 2:
        return None, None, "Insufficient Data"

    records = sorted(
        weather_history.values(),
        key=lambda x: x["timestamp"]
    )

    previous_temperature = records[-2]["temperature"]
    current_temperature = records[-1]["temperature"]

    if current_temperature > previous_temperature:
        trend = "📈 Rising"

    elif current_temperature < previous_temperature:
        trend = "📉 Falling"

    else:
        trend = "➡️ Stable"

    return (
        previous_temperature,
        current_temperature,
        trend
    )


# -----------------------------
# Energy Waste Detection
# -----------------------------

def energy_waste_detection(data):
    """
    Uses backend ML cooling demand output.
    """

    cooling_demand = data["predictions"]["cooling_demand"]

    recommendation = data["energy_recommendations"][0]

    return cooling_demand, recommendation


# -----------------------------
# Alert Severity
# -----------------------------

def get_alert_severity(predictions):
    """
    Determines overall alert severity from ML prediction values.
    """

    comfort = predictions["comfort_score"]
    learning = predictions["learning_quality"]
    indoor_temp = predictions["indoor_temperature"]
    indoor_humidity = predictions["indoor_humidity"]

    # HIGH
    if comfort < 40 or learning < 40:
        return "🔴 HIGH"

    # MEDIUM
    elif (
        comfort < 70
        or learning < 70
        or indoor_temp < 20
        or indoor_temp > 30
        or indoor_humidity > 80
    ):
        return "🟠 MEDIUM"

    # LOW
    else:
        return "🟢 LOW"