# ---------------------------------
# TwinVerse Prediction Engine
# Phase 4
# ---------------------------------

HIGH_OCCUPANCY_THRESHOLD = 80
TEMPERATURE_INCREASE_THRESHOLD = 3


# ---------------------------------
# Temperature Trend Analysis
# ---------------------------------
def temperature_trend(temperature_readings):

    if len(temperature_readings) < 2:
        return "Not enough data"

    if temperature_readings[-1] > temperature_readings[0]:
        return "📈 Rising"

    elif temperature_readings[-1] < temperature_readings[0]:
        return "📉 Falling"

    return "➖ Stable"



# ---------------------------------
# Alert Confidence Testing
# ---------------------------------
def alert_confidence(alert_type):

    confidence_scores = {

        "High Occupancy": 95,

        "Energy Waste Detected": 88,

        "Possible AC Degradation": 85,

        "Cooling Demand Increasing": 90,

        "All Systems Normal": 98
    }


    return confidence_scores.get(
        alert_type,
        50
    )



# ---------------------------------
# Confidence Based Alert Engine
# ---------------------------------
def confidence_alert_engine(
        occupancy,
        people_count,
        temperature,
        ac_status,
        temperature_readings
):

    alerts = []


    # High Occupancy
    if occupancy >= HIGH_OCCUPANCY_THRESHOLD:

        alerts.append({
            "alert": "High Occupancy",
            "confidence": alert_confidence(
                "High Occupancy"
            )
        })


    # Energy Waste
    if (
        people_count < 20
        and temperature < 24
    ):

        alerts.append({
            "alert": "Energy Waste Detected",
            "confidence": alert_confidence(
                "Energy Waste Detected"
            )
        })


    # AC Degradation

    increase = (
        temperature_readings[-1]
        -
        temperature_readings[0]
    )


    if (
        ac_status == "ON"
        and temperature_trend(temperature_readings)
        == "📈 Rising"
        and increase >= TEMPERATURE_INCREASE_THRESHOLD
    ):

        alerts.append({
            "alert": "Possible AC Degradation",
            "confidence": alert_confidence(
                "Possible AC Degradation"
            )
        })


    return alerts



# ---------------------------------
# Testing
# ---------------------------------
if __name__ == "__main__":


    occupancy = 85
    people_count = 10
    temperature = 22

    ac_status = "ON"


    temperatures = [
        24.0,
        25.0,
        26.0,
        27.5,
        28.0
    ]


    print(
        "===== TwinVerse AI Confidence Engine ====="
    )


    alerts = confidence_alert_engine(
        occupancy,
        people_count,
        temperature,
        ac_status,
        temperatures
    )


    for alert in alerts:

        print("\nAlert:",
              alert["alert"])

        print(
            "Confidence:",
            alert["confidence"],
            "%"
        )