from fastapi import FastAPI

app = FastAPI(
    title="TwinVerse Backend",
    version="1.0.0",
    description="Backend API for TwinVerse Smart Campus Digital Twin"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to TwinVerse Backend!",
        "status": "Running"
    }