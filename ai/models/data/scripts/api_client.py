import requests

BASE_URL = "https://subcapsular-genevive-sabulous.ngrok-free.dev"


def get_dashboard_data():
    """
    Fetch dashboard analytics data from the FastAPI backend.
    """
    endpoint = f"{BASE_URL}/api/analytics/dashboard"

    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print("Error fetching dashboard data:", e)
        return None


def get_weather_history():
    """
    Fetch weather history data from the FastAPI backend.
    """
    endpoint = f"{BASE_URL}/api/analytics/weather"

    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print("Error fetching weather history:", e)
        return None


if __name__ == "__main__":

    print("===== Dashboard Data =====")
    dashboard = get_dashboard_data()

    if dashboard:
        print(dashboard)

    print("\n===== Weather History =====")
    history = get_weather_history()

    if history:
        print(history)