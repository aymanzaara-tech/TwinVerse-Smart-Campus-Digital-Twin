from fastapi import APIRouter, Body
from app.firebase_config import database

router = APIRouter(
    prefix="/api",
    tags=["Settings"]
)


@router.get("/settings")
def get_settings():

    settings = database.child("settings").get()

    if not settings:
        default_settings = {
            "systemName": "TwinVerse",
            "campusName": "Sai Vidya Institute of Technology",
            "building": "Main Block",
            "seminarHall": "Smart Seminar Hall",

            "refreshRate": "30",

            "temperatureThreshold": 30,
            "humidityThreshold": 70,
            "occupancyLimit": 120,
            "iaqThreshold": 70,

            "liveUpdates": True,
            "notifications": True,

            "occupancyOverlay": True,
            "seatLabels": True,
            "heatmap": True,
            "cameraAnimation": True,
            "deviceStatus": True,

            "darkMode": True,
            "accentColor": "Blue",
            "compactMode": False,
            "animations": True
        }

        database.child("settings").set(default_settings)

        return default_settings

    return settings


@router.post("/settings")
def save_settings(settings: dict = Body(...)):

    database.child("settings").set(settings)

    return {
        "message": "Settings saved successfully.",
        "settings": settings
    }