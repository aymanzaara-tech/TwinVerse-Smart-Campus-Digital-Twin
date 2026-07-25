import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv

# Base directory (backend/)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")

# Read values from .env
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
firebase_database_url = os.getenv("FIREBASE_DATABASE_URL")

# Build path to the credentials JSON
SERVICE_ACCOUNT_KEY = BASE_DIR / "credentials" / firebase_credentials

if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_KEY))
    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL": firebase_database_url
        }
    )

database = db.reference("/")