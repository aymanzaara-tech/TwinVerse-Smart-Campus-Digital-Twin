from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.firebase_config import database
from app.routers.weather import router as weather_router
from app.routers.occupancy import router as occupancy_router
from app.routers import analytics
from app.routers import iaq
from app.routers import comfort
from app.routers import learning_quality
from app.routers import energy
from app.routers import cooling
from app.routers import alerts
from app.routers import settings

app = FastAPI(
    title="TwinVerse Backend",
    version="1.0.0",
    description="Backend API for TwinVerse Smart Campus Digital Twin"
)

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Register Routers
# ----------------------------
app.include_router(weather_router, prefix="/api", tags=["Weather"])
app.include_router(occupancy_router, prefix="/api", tags=["Occupancy"])
app.include_router(analytics.router)
app.include_router(iaq.router)
app.include_router(comfort.router)
app.include_router(learning_quality.router)
app.include_router(energy.router)
app.include_router(cooling.router)
app.include_router(alerts.router)
app.include_router(settings.router)

# ----------------------------
# Startup Event
# ----------------------------
@app.on_event("startup")
async def startup_event():
    try:
        database.child("test").set({
            "message": "TwinVerse Backend Connected!"
        })
        print("✅ Connected to Firebase successfully!")
    except Exception as e:
        print(f"❌ Firebase Connection Error: {e}")

# ----------------------------
# Home Route
# ----------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to TwinVerse Backend!",
        "status": "Running"
    }