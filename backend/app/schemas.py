from pydantic import BaseModel


class OccupancyData(BaseModel):
    room: str
    people_count: int