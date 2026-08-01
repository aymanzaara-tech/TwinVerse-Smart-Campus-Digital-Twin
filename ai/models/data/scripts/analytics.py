from api_client import get_dashboard_data, get_weather_history


# ---------------------------------
# TwinVerse AI Analytics Module
# Final Integration
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

def get_alert_severity(alert):
    """
    Derives severity from backend alert message.
    """

    alert = alert.lower()


    if "critical" in alert:
        return "🔴 HIGH"

    elif "warning" in alert:
        return "🟠 MEDIUM"

    elif "satisfactory" in alert or "normal" in alert:
        return "🟢 LOW"

    else:
        return "🟡 UNKNOWN"



# -----------------------------
# Final Analytics Output
# -----------------------------

if __name__ == "__main__":


    dashboard = get_dashboard_data()

    weather_history = get_weather_history()


    if dashboard and weather_history:


        # Occupancy

        people_count = dashboard["occupancy"]["people_count"]

        occupancy_density = (
            people_count / MAX_CAPACITY
        ) * 100


        occupancy_status = high_occupancy_alert(
            occupancy_density
        )


        # Temperature Trend

        previous_temp, current_temp, trend = temperature_trend(
            weather_history
        )


        # Energy

        cooling_demand, recommendation = energy_waste_detection(
            dashboard
        )


        # Alert

        alert = dashboard["alerts"][0]

        severity = get_alert_severity(
            alert
        )


        print("\n========== TwinVerse AI Analytics ==========")


        print("\nOccupancy Analytics")
        print("-------------------")
        print("Room:", dashboard["occupancy"]["room"])
        print("People Count:", people_count)
        print(f"Occupancy Density: {occupancy_density:.2f}%")
        print("Status:", occupancy_status)


        print("\nTemperature Trend")
        print("-----------------")
        print(f"Previous Temperature: {previous_temp}°C")
        print(f"Current Temperature: {current_temp}°C")
        print("Trend:", trend)


        print("\nEnergy Analytics")
        print("----------------")
        print(f"Cooling Demand: {cooling_demand}%")
        print("Recommendation:", recommendation)


        print("\nAlert Analysis")
        print("--------------")
        print("Alert:", alert)
        print("Severity:", severity)


        print("\n============================================")


    else:
        print("Failed to fetch backend data.")