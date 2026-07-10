from app.firebase_config import database


def save_occupancy(room: str, people_count: int):
    occupancy_data = {
        "room": room,
        "people_count": people_count
    }

    database.child("occupancy").set(occupancy_data)

    return {
        "message": "Occupancy data saved successfully!"
    }


def get_latest_occupancy():
    data = database.child("occupancy").get()

    if data:
        return data

    return {
        "message": "No occupancy data found."
    }