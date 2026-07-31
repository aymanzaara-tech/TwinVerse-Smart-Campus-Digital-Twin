"""
TwinVerse - Smart Campus Digital Twin
Dataset Generator

This script generates a realistic synthetic dataset
for training ML models to predict:

1. Indoor Temperature
2. Indoor Humidity
3. Comfort Score
4. Learning Quality
5. Cooling Demand
"""

import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
# ==========================
# CONFIGURATION
# ==========================

TOTAL_ROWS = 30000

START_DATE = datetime(2026, 1, 1, 8, 0)

TIME_INTERVAL = 5  # minutes
# ==========================
# DATA STORAGE
# ==========================

data = []
# ==========================
# OUTDOOR TEMPERATURE
# ==========================

def generate_outdoor_temperature(hour):
    """
    Simulates outdoor temperature based on time of day.
    """

    if 6 <= hour < 9:
        base = random.uniform(20, 25)

    elif 9 <= hour < 12:
        base = random.uniform(25, 30)

    elif 12 <= hour < 16:
        base = random.uniform(30, 36)

    elif 16 <= hour < 19:
        base = random.uniform(27, 32)

    else:
        base = random.uniform(20, 25)

    return round(base, 2)
# ==========================
# OUTDOOR HUMIDITY
# ==========================

def generate_outdoor_humidity(temp):
    """
    Humidity generally decreases as temperature increases.
    """

    humidity = 95 - (temp - 20) * 3

    humidity += random.uniform(-5, 5)

    humidity = max(35, min(95, humidity))

    return round(humidity, 2)
# ==========================
# OCCUPANCY
# ==========================

def generate_occupancy(hour, weekend):
    """
    Simulates seminar hall occupancy.
    """

    if weekend:
        return random.randint(0, 15)

    if 8 <= hour < 9:
        return random.randint(10, 30)

    elif 9 <= hour < 11:
        return random.randint(70, 120)

    elif 11 <= hour < 13:
        return random.randint(40, 80)

    elif 13 <= hour < 14:
        return random.randint(20, 50)

    elif 14 <= hour < 16:
        return random.randint(60, 110)

    elif 16 <= hour < 18:
        return random.randint(15, 40)

    else:
        return random.randint(0, 10)
    # ==========================
# INDOOR TEMPERATURE
# ==========================

def generate_indoor_temperature(outdoor_temp, occupancy):
    """
    Indoor temperature depends on
    outdoor temperature and occupancy.
    """

    indoor = (
        outdoor_temp
        - 2.5
        + occupancy * 0.035
        + random.uniform(-0.5, 0.5)
    )

    return round(indoor, 2)
# ==========================
# INDOOR HUMIDITY
# ==========================

def generate_indoor_humidity(outdoor_humidity, occupancy):
    """
    Indoor humidity increases slightly
    with occupancy.
    """

    humidity = outdoor_humidity - 8 + occupancy * 0.08

    humidity += random.uniform(-2, 2)

    humidity = max(30, min(90, humidity))

    return round(humidity, 2)
# ==========================
# COMFORT SCORE
# ==========================

def generate_comfort_score(indoor_temp, indoor_humidity):
    """
    Comfort is highest around:
    Temperature = 24–26°C
    Humidity = 45–60%
    """

    temp_penalty = abs(indoor_temp - 25) * 4
    humidity_penalty = abs(indoor_humidity - 55) * 0.8

    comfort = 100 - temp_penalty - humidity_penalty

    comfort += random.uniform(-3, 3)

    comfort = max(0, min(100, comfort))

    return round(comfort, 2)
# ==========================
# LEARNING QUALITY
# ==========================

def generate_learning_quality(comfort_score, occupancy):
    """
    Better comfort improves learning.
    Extremely crowded rooms reduce learning quality.
    """

    crowd_penalty = max(0, occupancy - 80) * 0.25

    learning = comfort_score - crowd_penalty

    learning += random.uniform(-2, 2)

    learning = max(0, min(100, learning))

    return round(learning, 2)
# ==========================
# COOLING DEMAND
# ==========================

def generate_cooling_demand(indoor_temp, occupancy):
    """
    Cooling demand increases with
    temperature and occupancy.
    """

    demand = (
        (indoor_temp - 20) * 5
        + occupancy * 0.25
    )

    demand += random.uniform(-3, 3)

    demand = max(0, min(100, demand))

    return round(demand, 2)
# ==========================
# DATASET GENERATION
# ==========================

current_time = START_DATE

for _ in range(TOTAL_ROWS):

    hour = current_time.hour
    day_of_week = current_time.weekday()
    is_weekend = 1 if day_of_week >= 5 else 0

    # Generate weather
    outdoor_temp = generate_outdoor_temperature(hour)
    outdoor_humidity = generate_outdoor_humidity(outdoor_temp)

    # Generate occupancy
    occupancy = generate_occupancy(hour, is_weekend)

    # Generate indoor conditions
    indoor_temp = generate_indoor_temperature(
        outdoor_temp,
        occupancy
    )

    indoor_humidity = generate_indoor_humidity(
        outdoor_humidity,
        occupancy
    )

    # Generate predictions
    comfort = generate_comfort_score(
        indoor_temp,
        indoor_humidity
    )

    learning = generate_learning_quality(
        comfort,
        occupancy
    )

    cooling = generate_cooling_demand(
        indoor_temp,
        occupancy
    )

    # Save row
    data.append({
        "timestamp": current_time,
        "hour": hour,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "outdoor_temperature": outdoor_temp,
        "outdoor_humidity": outdoor_humidity,
        "occupancy": occupancy,
        "indoor_temperature": indoor_temp,
        "indoor_humidity": indoor_humidity,
        "comfort_score": comfort,
        "learning_quality": learning,
        "cooling_demand": cooling
    })

    current_time += timedelta(minutes=TIME_INTERVAL)
    # ==========================
# SAVE DATASET
# ==========================

df = pd.DataFrame(data)

output_path = "ml/generated/historical_dataset.csv"

df.to_csv(output_path, index=False)

print("=" * 50)
print("TwinVerse Dataset Generated Successfully!")
print("=" * 50)
print(f"Total Records : {len(df)}")
print(f"Saved To      : {output_path}")
print("=" * 50)

print("\nFirst 5 Rows:\n")
print(df.head())