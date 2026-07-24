# ---------------------------------
# TwinVerse Analytics Engine
# Phase 3
# ---------------------------------

TOTAL_SEATS = 100


# ---------------------------------
# Occupancy Density
# ---------------------------------
def occupancy_density(people_count):
    density = (people_count / TOTAL_SEATS) * 100
    return round(density, 2)


# ---------------------------------
# Temperature Normalization
# ---------------------------------
def temperature_score(temperature):

    if 20 <= temperature <= 24:
        return 100

    elif temperature < 20:
        score = 100 - ((20 - temperature) * 10)

    else:
        score = 100 - ((temperature - 24) * 10)

    return max(0, round(score, 2))


# ---------------------------------
# Humidity Normalization
# ---------------------------------
def humidity_score(humidity):

    if 40 <= humidity <= 60:
        return 100

    elif humidity < 40:
        score = 100 - ((40 - humidity) * 5)

    else:
        score = 100 - ((humidity - 60) * 5)

    return max(0, round(score, 2))


# ---------------------------------
# Environmental Data Validation
# ---------------------------------
def validate_environment(temperature, humidity, people_count):

    if temperature is None:
        raise ValueError("Temperature is missing.")

    if humidity is None:
        raise ValueError("Humidity is missing.")

    if people_count is None:
        raise ValueError("People count is missing.")

    if humidity < 0 or humidity > 100:
        raise ValueError("Humidity must be between 0 and 100.")

    if people_count < 0:
        raise ValueError("People count cannot be negative.")

    return True


# ---------------------------------
# Comfort Score
# ---------------------------------
def comfort_score(temp_score, hum_score, density):

    occupancy_score = max(0, 100 - density)

    score = (
        (0.40 * temp_score) +
        (0.30 * hum_score) +
        (0.30 * occupancy_score)
    )

    return round(score, 2)


# ---------------------------------
# Learning Quality Index
# ---------------------------------
def learning_quality_index(comfort):

    if comfort >= 85:
        return "Excellent"

    elif comfort >= 70:
        return "Good"

    elif comfort >= 50:
        return "Average"

    else:
        return "Poor"


# ---------------------------------
# Testing
# ---------------------------------
if __name__ == "__main__":

    people_count = 23
    temperature = 27.6
    humidity = 54

    validate_environment(
        temperature,
        humidity,
        people_count
    )

    density = occupancy_density(people_count)

    temp = temperature_score(temperature)

    hum = humidity_score(humidity)

    comfort = comfort_score(
        temp,
        hum,
        density
    )

    learning = learning_quality_index(
        comfort
    )

    print("People Count:", people_count)
    print("Occupancy Density:", density, "%")

    print("\nTemperature:", temperature, "°C")
    print("Temperature Score:", temp)

    print("\nHumidity:", humidity, "%")
    print("Humidity Score:", hum)

    print("\nComfort Score:", comfort)

    print("Learning Quality Index:", learning)