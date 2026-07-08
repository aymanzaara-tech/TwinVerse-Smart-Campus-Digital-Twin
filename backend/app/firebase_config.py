import firebase_admin
from firebase_admin import credentials, db
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SERVICE_ACCOUNT_KEY = (
    BASE_DIR / "credentials" / "twinverse-65b49-firebase-adminsdk-fbsvc-1871337dba.json"
)

if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_KEY))
    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL": "https://twinverse-65b49-default-rtdb.asia-southeast1.firebasedatabase.app"
        }
    )

database = db.reference("/")