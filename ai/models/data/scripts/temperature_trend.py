from api_client import get_weather_history


def temperature_trend(weather_history):
    """
    Determines whether the outdoor temperature is
    Rising, Falling or Stable.
    """

    if len(weather_history) < 2:
        return None

    records = sorted(
        weather_history.values(),
        key=lambda x: x["timestamp"]
    )

    previous = records[-2]["temperature"]
    current = records[-1]["temperature"]

    if current > previous:
        trend = "📈 Rising"

    elif current < previous:
        trend = "📉 Falling"

    else:
        trend = "➡️ Stable"

    return previous, current, trend


if __name__ == "__main__":

    history = get_weather_history()

    if history:

        result = temperature_trend(history)

        if result:

            previous, current, trend = result

            print("===== TwinVerse Temperature Trend =====")
            print(f"Previous Temperature : {previous}°C")
            print(f"Current Temperature  : {current}°C")
            print(f"Trend                : {trend}")

        else:
            print("Not enough weather history.")

    else:
        print("Failed to fetch weather history.")