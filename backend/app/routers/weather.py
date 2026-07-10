from fastapi import APIRouter
from app.services.weather_service import fetch_weather, get_latest_weather

router = APIRouter()


@router.get("/weather")
def get_weather():
    return fetch_weather()


@router.get("/weather/latest")
def latest_weather():
    return get_latest_weather()