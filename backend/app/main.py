import logging
from contextlib import asynccontextmanager
from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.firebase_config import database

# Existing routers
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

# Sensor router
from app.routers import sensors

# ThingSpeak polling service
from app.services.thingspeak_service import (
    start_thingspeak_poller,
    stop_thingspeak_poller,
)


# --------------------------------------------------
# LOGGING
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --------------------------------------------------
# YOLOv8 MODEL CONFIGURATION
# --------------------------------------------------

MODEL_PATH = Path.home() / "ProjectAI" / "yolov8n.pt"

yolo_model = None


# --------------------------------------------------
# APPLICATION LIFESPAN
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global yolo_model

    # Start ThingSpeak polling
    start_thingspeak_poller()

    # Check Firebase connection
    try:
        database.child("test").set({
            "message": "TwinVerse Backend Connected!"
        })

        logger.info("Connected to Firebase successfully!")

    except Exception:
        logger.exception("Firebase connection error")

    # Load YOLOv8 model
    try:
        if not MODEL_PATH.is_file():
            raise FileNotFoundError(
                f"YOLOv8 model not found: {MODEL_PATH}"
            )

        yolo_model = YOLO(str(MODEL_PATH))

        logger.info("YOLOv8 model loaded successfully!")

    except Exception:
        logger.exception(
            "YOLOv8 model could not be loaded. "
            "The YOLO occupancy endpoint will be unavailable."
        )

    yield

    # Stop ThingSpeak polling
    stop_thingspeak_poller()

    logger.info("TwinVerse backend shutting down.")


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="TwinVerse Backend",
    version="1.1.0",
    description=(
        "Backend API for TwinVerse Smart Campus Digital Twin, "
        "including sensor monitoring, analytics, and YOLOv8 "
        "image-based occupancy detection."
    ),
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://decimal-womanless-impose.ngrok-free.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REGISTER EXISTING ROUTERS
# --------------------------------------------------

app.include_router(
    weather_router,
    prefix="/api",
    tags=["Weather"],
)

app.include_router(
    occupancy_router,
    prefix="/api",
    tags=["Occupancy"],
)

app.include_router(analytics.router)
app.include_router(iaq.router)
app.include_router(comfort.router)
app.include_router(learning_quality.router)
app.include_router(energy.router)
app.include_router(cooling.router)
app.include_router(alerts.router)
app.include_router(settings.router)


# --------------------------------------------------
# REGISTER SENSOR ROUTER
# --------------------------------------------------

app.include_router(
    sensors.router,
    prefix="/api",
    tags=["Sensors"],
)


# --------------------------------------------------
# YOLOv8 IMAGE-BASED OCCUPANCY DETECTION
# --------------------------------------------------

@app.post(
    "/api/yolo-occupancy",
    tags=["YOLOv8 Occupancy"],
    summary="Detect seminar hall occupancy from an image",
)
async def detect_yolo_occupancy(
    file: UploadFile = File(...),
):
    """
    Upload a seminar hall photograph.

    YOLOv8 detects people in the image and returns
    the number of detected people.
    """

    global yolo_model

    # Ensure the model is available
    if yolo_model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "YOLOv8 model is unavailable. "
                "Check the backend logs and model path."
            ),
        )

    # Validate image content type
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPEG, PNG, or WEBP image.",
        )

    try:
        # Read uploaded image
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded image is empty.",
            )

        # Decode image using OpenCV
        image_array = np.frombuffer(
            contents,
            dtype=np.uint8,
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR,
        )

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Could not decode the uploaded image.",
            )

        # Run YOLOv8 person detection
        results = yolo_model.predict(
            source=image,
            imgsz=1280,
            conf=0.12,
            classes=[0],
            verbose=False,
        )

        # Count detected people
        people_count = len(results[0].boxes)

        logger.info(
            "YOLOv8 detected %s people in %s",
            people_count,
            file.filename,
        )

        # Return occupancy result to Swagger
        return {
            "room": "Seminar Hall",
            "people_count": people_count,
            "model": "YOLOv8n",
            "image_filename": file.filename,
            "status": "success",
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception("YOLOv8 occupancy detection failed")

        raise HTTPException(
            status_code=500,
            detail="An error occurred during YOLOv8 detection.",
        )

    finally:
        await file.close()


# --------------------------------------------------
# HOME ROUTE
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to TwinVerse Backend!",
        "status": "Running",
    }