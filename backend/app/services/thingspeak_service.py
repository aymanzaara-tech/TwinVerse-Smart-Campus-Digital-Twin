import os
import time
import logging
import threading
import requests

from pathlib import Path
from dotenv import load_dotenv

from app.services.sensor_service import save_sensor_reading


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

THINGSPEAK_CHANNEL_ID = os.getenv("THINGSPEAK_CHANNEL_ID")
THINGSPEAK_READ_KEY = os.getenv("THINGSPEAK_READ_KEY")

THINGSPEAK_POLL_SECONDS = max(
    15,
    int(os.getenv("THINGSPEAK_POLL_SECONDS", "60"))
)

THINGSPEAK_DEVICE_ID = os.getenv(
    "THINGSPEAK_DEVICE_ID",
    "seminar-hall-node-1"
)

logger = logging.getLogger(__name__)

_poller_thread = None
_stop_event = threading.Event()

# Remember the last successfully processed ThingSpeak entry.
_last_processed_entry_id = None


# --------------------------------------------------
# FETCH LATEST DATA FROM THINGSPEAK
# --------------------------------------------------

def fetch_thingspeak_data():
    """Fetch the latest sensor readings from ThingSpeak."""

    if not THINGSPEAK_CHANNEL_ID:
        raise ValueError(
            "THINGSPEAK_CHANNEL_ID is missing from .env"
        )

    if not THINGSPEAK_READ_KEY:
        raise ValueError(
            "THINGSPEAK_READ_KEY is missing from .env"
        )

    url = (
        "https://api.thingspeak.com/channels/"
        f"{THINGSPEAK_CHANNEL_ID}/feeds/last.json"
    )

    response = requests.get(
        url,
        params={"api_key": THINGSPEAK_READ_KEY},
        timeout=10
    )

    response.raise_for_status()
    feed = response.json()

    if not feed.get("entry_id"):
        raise ValueError(
            "ThingSpeak returned no valid sensor entry"
        )

    def parse_value(field_name):
        value = feed.get(field_name)

        if value in (None, ""):
            return None

        return float(value)

    return {
        "device_id": THINGSPEAK_DEVICE_ID,
        "temperature": parse_value("field1"),
        "humidity": parse_value("field2"),
        "gas_reading": parse_value("field3"),
        "timestamp": feed.get("created_at"),
        "thingspeak_entry_id": feed.get("entry_id"),
        "source": "thingspeak"
    }


# --------------------------------------------------
# SAVE DATA TO FIREBASE
# --------------------------------------------------

def save_thingspeak_reading(sensor_data):
    """
    Save ThingSpeak readings through the existing sensor
    service so Firebase paths remain consistent.
    """

    data_to_save = {
        key: value
        for key, value in sensor_data.items()
        if key != "thingspeak_entry_id"
    }

    result = save_sensor_reading(data_to_save)

    logger.info(
        "ThingSpeak reading saved to Firebase. "
        "Entry ID: %s, device: %s",
        sensor_data.get("thingspeak_entry_id"),
        sensor_data.get("device_id")
    )

    return result


# --------------------------------------------------
# AUTOMATIC POLLING
# --------------------------------------------------

def poll_thingspeak():
    """Fetch new readings and save them to Firebase."""

    global _last_processed_entry_id

    logger.info(
        "ThingSpeak-to-Firebase polling started. "
        "Interval: %s seconds",
        THINGSPEAK_POLL_SECONDS
    )

    while not _stop_event.is_set():

        try:
            data = fetch_thingspeak_data()
            entry_id = data["thingspeak_entry_id"]

            # Avoid repeatedly saving the same ThingSpeak entry.
            if entry_id == _last_processed_entry_id:
                logger.info(
                    "ThingSpeak entry %s is unchanged; "
                    "skipping duplicate.",
                    entry_id
                )
            else:
                save_thingspeak_reading(data)

                # Mark processed only after the Firebase write succeeds.
                _last_processed_entry_id = entry_id

        except Exception:
            logger.exception(
                "ThingSpeak fetch or Firebase save failed"
            )

        _stop_event.wait(THINGSPEAK_POLL_SECONDS)

    logger.info("ThingSpeak polling stopped.")


# --------------------------------------------------
# START POLLING
# --------------------------------------------------

def start_thingspeak_poller():
    """Start one background polling thread."""

    global _poller_thread

    if (
        _poller_thread is not None
        and _poller_thread.is_alive()
    ):
        logger.info(
            "ThingSpeak polling is already running."
        )
        return

    _stop_event.clear()

    _poller_thread = threading.Thread(
        target=poll_thingspeak,
        name="ThingSpeakPoller",
        daemon=True
    )

    _poller_thread.start()


# --------------------------------------------------
# STOP POLLING
# --------------------------------------------------

def stop_thingspeak_poller():
    """Stop the polling thread gracefully."""

    global _poller_thread

    _stop_event.set()

    if (
        _poller_thread is not None
        and _poller_thread.is_alive()
    ):
        _poller_thread.join(timeout=12)

    logger.info("ThingSpeak poller shutdown complete.")