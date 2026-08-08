# TwinVerse — Version 1.0

## Digital Twin for a Smart Seminar Hall

TwinVerse is a smart-campus digital twin system designed to provide a **real-time virtual representation of a seminar hall**. It combines environmental data, occupancy information, machine-learning predictions, AI-based analytics, historical data, and a 3D digital representation to monitor and understand the condition of the space.

Version 1 focuses on establishing the **core digital twin pipeline**, from data acquisition to prediction, analytics, cloud storage, and dashboard visualization.

---

## Key Features

* 🌡️ Real-time environmental monitoring
* 👥 Occupancy monitoring
* 🤖 ML-based environmental and comfort predictions
* 📊 AI analytics and trend analysis
* ⚡ Energy-related recommendations
* 🚨 Environmental and occupancy alerts
* 📚 Historical weather and prediction data
* ☁️ Firebase-based cloud data synchronization
* 🏫 Interactive 3D digital twin representation
* 📈 Dashboard-based visualization

---

## System Flow

```text
Environmental Data + Occupancy Data
                ↓
        Data Acquisition
                ↓
        Data Preprocessing
                ↓
          ML Prediction
                ↓
        AI Analytics Layer
                ↓
 Recommendations + Alerts
                ↓
       Firebase Database
                ↓
        FastAPI Backend
                ↓
       React Dashboard
                ↓
       3D Digital Twin
```

---

## Technology Stack

### Backend

* Python
* FastAPI
* Uvicorn

### Machine Learning

* Python
* Scikit-learn
* Trained prediction models

### Environmental Data

* Open-Meteo API

### Database

* Firebase Realtime Database

### Frontend

* React
* Vite

### Digital Twin

* Three.js
* 3D seminar-hall model

### Development Tools

* Git
* GitHub
* VS Code

---

## ML Prediction Module

TwinVerse uses trained machine-learning models to estimate:

* Indoor Temperature
* Indoor Humidity
* Comfort Score
* Learning Quality
* Cooling Demand

The prediction system uses factors such as:

* Time of day
* Day of week
* Weekend status
* Outdoor temperature
* Outdoor humidity
* Occupancy

---

## AI Analytics

The AI analytics layer provides additional interpretation of the collected and predicted data.

### Occupancy Analytics

Determines occupancy density and identifies high-occupancy conditions.

### Temperature Trend

Compares historical temperature records to identify whether temperature is:

* 📈 Rising
* 📉 Falling
* ➡️ Stable

### Energy Analytics

Uses cooling-demand predictions to provide energy-related recommendations.

### Alert Severity

Evaluates prediction values to classify overall conditions as:

* 🟢 LOW
* 🟠 MEDIUM
* 🔴 HIGH

---

## Data Storage

Firebase Realtime Database stores:

```text
weather
weather_history
occupancy
latest_prediction
prediction_history
prediction_cache
```

Historical records allow TwinVerse to track changes over time and support trend visualization.

---

## Backend API

The FastAPI backend exposes endpoints for the dashboard and analytics.

### Main Endpoints

```text
GET /api/weather
GET /api/analytics/dashboard
GET /api/analytics/weather
GET /api/analytics/weather/average
GET /api/analytics/history
```

Interactive API documentation is available through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## Project Structure

```text
TwinVerse-Smart-Campus-Digital-Twin/
│
├── app/
│   ├── main.py
│   ├── firebase_config.py
│   │
│   ├── routes/
│   │   └── analytics.py
│   │
│   └── services/
│       ├── analytics.py
│       ├── ml_predictor.py
│       ├── prediction_service.py
│       ├── recommendation_service.py
│       └── weather_service.py
│
├── ml/
│   ├── generated/
│   │   └── historical_dataset.csv
│   │
│   ├── models/
│   │   ├── indoor_temperature
│   │   ├── indoor_humidity
│   │   ├── comfort_score
│   │   ├── learning_quality
│   │   └── cooling_demand
│   │
│   ├── scripts/
│   │   └── dataset_generator.py
│   │
│   └── training/
│       └── train_models.py
│
├── frontend/
│   └── ...
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd TwinVerse-Smart-Campus-Digital-Twin
```

### 2. Create virtual environment

```bash
python -m venv .venv
```

### 3. Activate virtual environment

Windows:

```bash
.venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Backend

From the project root:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## Version 1 Scope

Version 1 establishes the complete basic digital-twin pipeline:

```text
Data Collection
      ↓
Data Storage
      ↓
ML Prediction
      ↓
AI Analytics
      ↓
Alerts & Recommendations
      ↓
Historical Data
      ↓
Dashboard
      ↓
3D Digital Twin
```

The architecture is designed so that additional sensors, advanced predictive models, and more sophisticated digital-twin interactions can be incorporated in future versions.

---

## Future Enhancements

Potential improvements for future versions include:

* Physical IoT sensor integration
* More real-time sensor streams
* Advanced time-series prediction
* Improved occupancy analysis
* Energy consumption measurement
* Automated HVAC control
* More detailed 3D simulation
* Real-time interaction between the physical space and digital twin
* Mobile application support

---

## Team

**Project:** TwinVerse — Smart Campus Digital Twin
**Domain:** Smart Campus / Digital Twin / Machine Learning
**Version:** 1.0
**Institution:** Sai Vidya Institute of Technology, Bengaluru
**Academic Year:** 2026–2027
