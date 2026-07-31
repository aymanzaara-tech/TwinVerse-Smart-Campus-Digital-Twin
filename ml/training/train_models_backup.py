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
# FEATURES AND TARGET
# =====================================

FEATURES = [
    "hour",
    "day_of_week",
    "is_weekend",
    "outdoor_temperature",
    "outdoor_humidity",
    "occupancy",
]

TARGET = "indoor_temperature"

X = df[FEATURES]
y = df[TARGET]

print("\n" + "=" * 60)
print("FEATURES AND TARGET")
print("=" * 60)

print("\nFeatures:")
print(FEATURES)

print("\nTarget:")
print(TARGET)
# =====================================
# TRAIN TEST SPLIT
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)

print("\n" + "=" * 60)
print("TRAIN TEST SPLIT")
print("=" * 60)

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")
# =====================================
# TRAIN RANDOM FOREST MODEL
# =====================================

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

print("\nTraining Indoor Temperature Model...")

model.fit(X_train, y_train)

print("Training Completed Successfully!")
# =====================================
# PREDICTIONS
# =====================================

predictions = model.predict(X_test)
# =====================================
# MODEL EVALUATION
# =====================================

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\n" + "=" * 60)
print("MODEL PERFORMANCE")
print("=" * 60)

print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R²   : {r2:.4f}")
# =====================================
# SAVE MODEL
# =====================================

os.makedirs("ml/models", exist_ok=True)

MODEL_PATH = "ml/models/indoor_temperature.pkl"

joblib.dump(model, MODEL_PATH)

print("\nIndoor Temperature Model Saved Successfully!")
print(f"Location: {MODEL_PATH}")