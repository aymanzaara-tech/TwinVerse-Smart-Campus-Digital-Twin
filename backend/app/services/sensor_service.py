from datetime import datetime, timezone

from app.firebase_config import database


def save_sensor_reading(sensor_data: dict) -> dict:
    """Save sensor readings without allowing an older reading to overwrite newer data."""

    device_id = sensor_data.get("device_id")
    if not device_id:
        raise ValueError("device_id is required")

    received_at = datetime.now(timezone.utc).isoformat()

    reading = {
        "device_id": device_id,
        "temperature": sensor_data.get("temperature"),
        "humidity": sensor_data.get("humidity"),
        "gas_reading": sensor_data.get("gas_reading"),
        "timestamp": sensor_data.get("timestamp") or received_at,
        "received_at": received_at,
        "source": sensor_data.get("source", "esp32"),
    }
    reading = {k: v for k, v in reading.items() if v is not None}

    latest_ref = database.child("sensors").child("latest")
    existing = latest_ref.get()

    # Keep the latest reading according to its measurement timestamp.
    should_update_latest = True
    if isinstance(existing, dict):
        old_timestamp = existing.get("timestamp")
        new_timestamp = reading.get("timestamp")
        if old_timestamp and new_timestamp:
            try:
                old_dt = datetime.fromisoformat(old_timestamp.replace("Z", "+00:00"))
                new_dt = datetime.fromisoformat(new_timestamp.replace("Z", "+00:00"))
                if old_dt > new_dt:
                    should_update_latest = False
            except (ValueError, TypeError):
                pass

    if should_update_latest:
        latest_ref.set(reading)

    database.child("sensor_history").push(reading)

    database.child("device_status").child(device_id).update({
        "device_id": device_id,
        "online": True,
        "last_seen": received_at,
        "last_reading": reading,
    })

    return {
        "message": "Sensor reading saved successfully",
        "device_id": device_id,
        "received_at": received_at,
    }


def get_latest_sensor_reading() -> dict | None:
    """Return the latest stored sensor reading."""
    return database.child("sensors").child("latest").get()


def get_sensor_device_status(device_id: str = "seminar-hall-node-1") -> dict | None:
    """Return stored device status."""
    return database.child("device_status").child(device_id).get()


def get_sensor_history(limit: int = 100) -> list:
    """Return up to limit recent historical sensor readings."""
    records = database.child("sensor_history").get()

    if not isinstance(records, dict):
        return []

    readings = []
    for record_id, reading in records.items():
        if isinstance(reading, dict):
            readings.append({
                **reading,
                "record_id": record_id,
            })

    readings.sort(
        key=lambda item: item.get("received_at", ""),
        reverse=True,
    )

    return readings[:limit]
