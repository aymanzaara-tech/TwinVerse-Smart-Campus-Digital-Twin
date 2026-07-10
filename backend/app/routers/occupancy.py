from fastapi import APIRouter
from app.schemas import OccupancyData
from app.services.occupancy_service import (
    save_occupancy,
    get_latest_occupancy,
)

router = APIRouter()


@router.post("/occupancy")
def create_occupancy(data: OccupancyData):
    return save_occupancy(
        room=data.room,
        people_count=data.people_count
    )


@router.get("/occupancy")
def read_occupancy():
    return get_latest_occupancy()