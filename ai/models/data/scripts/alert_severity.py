from api_client import get_dashboard_data


def get_alert_severity(alert):
    """
    Determines alert severity based on alert message.
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


if __name__ == "__main__":

    data = get_dashboard_data()

    if data:

        alert = data["alerts"][0]
        severity = get_alert_severity(alert)

        print("===== TwinVerse Alert Severity =====")
        print(f"Alert     : {alert}")
        print(f"Severity  : {severity}")

    else:
        print("Failed to fetch backend data.")