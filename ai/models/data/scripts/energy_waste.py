from api_client import get_dashboard_data


def energy_waste_detection(data):
    """
    Uses backend ML prediction and recommendation
    to report energy usage.
    """

    cooling_demand = data["predictions"]["cooling_demand"]
    recommendation = data["energy_recommendations"][0]

    print("===== TwinVerse Energy Analytics =====")
    print(f"Cooling Demand : {cooling_demand:.2f}%")
    print(f"Recommendation : {recommendation}")


if __name__ == "__main__":

    data = get_dashboard_data()

    if data:
        energy_waste_detection(data)
    else:
        print("Failed to fetch backend data.")