import os
import secrets

from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.sensor_service import (
    save_sensor_reading,
    get_latest_sensor_reading,
    get_sensor_device_status,
    get_sensor_history,
)

router = APIRouter()


class SensorReading(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=100)
    temperature: float | None = None
    humidity: float | None = None
    gas_reading: float | None = None
    timestamp: str | None = None


def verify_api_key(x_api_key: str | None) -> None:
    expected_api_key = os.getenv("SENSOR_API_KEY")

    if not expected_api_key:
        raise HTTPException(
            status_code=503,
            detail="Sensor API key is not configured",
        )

    if not x_api_key or not secrets.compare_digest(x_api_key, expected_api_key):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


@router.post("/sensors")
def receive_sensor_reading(
    reading: SensorReading,
    x_api_key: str | None = Header(default=None),
):
    verify_api_key(x_api_key)

    sensor_data = reading.model_dump(exclude_none=True)
    sensor_data["source"] = "esp32"

    try:
        result = save_sensor_reading(sensor_data)
        return {"success": True, **result}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save sensor reading")


@router.get("/sensors/latest")
def latest_sensor_reading():
    try:
        reading = get_latest_sensor_reading()
        if not reading:
            raise HTTPException(status_code=404, detail="No sensor readings available")
        return reading
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve latest sensor reading")


@router.get("/sensors/status")
def sensor_device_status(
    device_id: str = Query(default="seminar-hall-node-1", min_length=1, max_length=100),
):
    try:
        status = get_sensor_device_status(device_id)
        if not status:
            raise HTTPException(status_code=404, detail="Device status not found")
        return status
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve device status")


@router.get("/sensors/history")
def sensor_reading_history(
    limit: int = Query(default=100, ge=1, le=1000),
):
    try:
        return {
            "count": len(get_sensor_history(limit)),
            "readings": get_sensor_history(limit),
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve sensor history")
