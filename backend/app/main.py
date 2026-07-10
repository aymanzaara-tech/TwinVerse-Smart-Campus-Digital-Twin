from fastapi import FastAPI
from app.firebase_config import database
from app.schemas import OccupancyData
from app.routers.weather import router as weather_router
app = FastAPI(
    title="TwinVerse Backend",
    version="1.0.0",
    description="Backend API for TwinVerse Smart Campus Digital Twin"
)
app.include_router(weather_router, prefix="/api", tags=["Weather"])

@app.on_event("startup")
async def startup_event():
    try:
        database.child("test").set({
            "message": "TwinVerse Backend Connected!"
        })
        print("✅ Connected to Firebase successfully!")
    except Exception as e:
        print(f"❌ Firebase Connection Error: {e}")

@app.get("/")
def home():
    return {
        "message": "Welcome to TwinVerse Backend!",
        "status": "Running"
    }
@app.post("/api/occupancy")
def save_occupancy(data: OccupancyData):
    database.child("occupancy").set({
        "room": data.room,
        "people_count": data.people_count
    })

    return {
        "message": "Occupancy data saved successfully!"
    }