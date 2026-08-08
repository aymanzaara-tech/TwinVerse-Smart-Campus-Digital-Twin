import os
import joblib
import pandas as pd

# =====================================
# MODEL PATH
# =====================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "..", "ml", "models")

# =====================================
# LOAD MODELS
# =====================================

indoor_temperature_model = joblib.load(
    os.path.join(MODEL_DIR, "indoor_temperature.pkl")
)

indoor_humidity_model = joblib.load(
    os.path.join(MODEL_DIR, "indoor_humidity.pkl")
)

comfort_model = joblib.load(
    os.path.join(MODEL_DIR, "comfort_score.pkl")
)

learning_model = joblib.load(
    os.path.join(MODEL_DIR, "learning_quality.pkl")
)

cooling_model = joblib.load(
    os.path.join(MODEL_DIR, "cooling_demand.pkl")
)

# =====================================
# PREDICTION FUNCTION
# =====================================

def predict(
    hour,
    day_of_week,
    is_weekend,
    outdoor_temperature,
    outdoor_humidity,
    occupancy,
):

    data = pd.DataFrame([{
        "hour": hour,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "outdoor_temperature": outdoor_temperature,
        "outdoor_humidity": outdoor_humidity,
        "occupancy": occupancy,
    }])

    return {
        "indoor_temperature": float(
            indoor_temperature_model.predict(data)[0]
        ),
        "indoor_humidity": float(
            indoor_humidity_model.predict(data)[0]
        ),
        "comfort_score": float(
            comfort_model.predict(data)[0]
        ),
        "learning_quality": float(
            learning_model.predict(data)[0]
        ),
        "cooling_demand": float(
            cooling_model.predict(data)[0]
        ),
    }