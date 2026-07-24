# ---------------------------------
# TwinVerse Prediction Engine
# Phase 4
# ---------------------------------

HIGH_OCCUPANCY_THRESHOLD = 80


def high_occupancy_alert(occupancy_density):
    """
    Generates an alert if occupancy exceeds threshold.
    """

    if occupancy_density >= HIGH_OCCUPANCY_THRESHOLD:
        return "🚨 High Occupancy Alert"

    return "✅ Occupancy Normal"


# -----------------------------
# Testing
# -----------------------------
if __name__ == "__main__":

    occupancy = 85

    alert = high_occupancy_alert(
        occupancy
    )

    print("Occupancy:", occupancy, "%")
    print(alert)