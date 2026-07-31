"""
TwinVerse ML Training Pipeline
Phase 2 - Data Validation
"""
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
import pandas as pd

# =====================================
# LOAD DATASET
# =====================================

DATASET_PATH = "ml/generated/historical_dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("=" * 60)
print("TwinVerse Dataset Validation")
print("=" * 60)

print("\nFirst 5 Rows")
print(df.head())

print("\nDataset Shape")
print(df.shape)

print("\nColumns")
print(df.columns.tolist())

print("\nMissing Values")
print(df.isnull().sum())

print("\nDuplicate Rows")
print(df.duplicated().sum())

print("\nData Types")
print(df.dtypes)

print("\nSummary Statistics")
print(df.describe())

# =====================================
# FEATURES
# =====================================

FEATURES = [
    "hour",
    "day_of_week",
    "is_weekend",
    "outdoor_temperature",
    "outdoor_humidity",
    "occupancy",
]
# =====================================
# TRAIN MODEL FUNCTION
# =====================================

def train_model(target):

    print("\n" + "=" * 60)
    print(f"Training Model : {target}")
    print("=" * 60)

    X = df[FEATURES]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    print(f"Training Samples : {len(X_train)}")
    print(f"Testing Samples  : {len(X_test)}")

    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R²   : {r2:.4f}")

    os.makedirs("ml/models", exist_ok=True)

    model_path = f"ml/models/{target}.pkl"

    joblib.dump(model, model_path)

    print(f"Saved : {model_path}")
    # =====================================
# TRAIN ALL MODELS
# =====================================

TARGETS = [
    "indoor_temperature",
    "indoor_humidity",
    "comfort_score",
    "learning_quality",
    "cooling_demand",
]

for target in TARGETS:
    train_model(target)

print("\n" + "=" * 60)
print("ALL MODELS TRAINED SUCCESSFULLY")
print("=" * 60)