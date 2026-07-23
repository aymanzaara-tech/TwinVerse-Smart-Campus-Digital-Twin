from ultralytics import YOLO
import cv2
import numpy as np
import requests
import time
from zones import zones


# -----------------------------
# Configuration
# -----------------------------
TOTAL_SEATS = 100

API_URL = "https://subcapsular-genevive-sabulous.ngrok-free.dev/api/occupancy"

last_sent_time = 0


# -----------------------------
# Load YOLO Model
# -----------------------------
model = YOLO("yolov8n.pt")


# -----------------------------
# Load Video
# -----------------------------
cap = cv2.VideoCapture("seminar_hall.mp4")


while cap.isOpened():

    ret, frame = cap.read()

    if not ret:
        break


    # -----------------------------
    # Draw Zones
    # -----------------------------
    for zone_name, points in zones.items():

        polygon = np.array(points, np.int32)

        cv2.polylines(
            frame,
            [polygon],
            True,
            (255, 0, 0),
            3
        )

        x, y = points[0]

        cv2.putText(
            frame,
            zone_name,
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 0, 0),
            2
        )


    # -----------------------------
    # YOLO Detection
    # -----------------------------
    results = model(
        frame,
        classes=[0],
        imgsz=1280,
        conf=0.12,
        iou=0.45,
        augment=True
    )


    zone_counts = {
        "Zone_A": 0,
        "Zone_B": 0,
        "Zone_C": 0
    }


    total_people = 0


    # -----------------------------
    # Process People
    # -----------------------------
    for box in results[0].boxes:

        x1, y1, x2, y2 = box.xyxy[0]

        x1 = int(x1)
        y1 = int(y1)
        x2 = int(x2)
        y2 = int(y2)


        width = x2 - x1
        height = y2 - y1


        if width > 20 and height > 40:

            total_people += 1

            # Person center point
            center_x = int((x1 + x2) / 2)
            center_y = int((y1 + y2) / 2)


            cv2.circle(
                frame,
                (center_x, center_y),
                5,
                (0,255,0),
                -1
            )


            person_zone = "None"


            # -----------------------------
            # Point-in-Polygon Mapping
            # -----------------------------
            for zone_name, points in zones.items():

                polygon = np.array(points, np.int32)

                inside = cv2.pointPolygonTest(
                    polygon,
                    (center_x, center_y),
                    False
                )


                if inside >= 0:

                    zone_counts[zone_name] += 1
                    person_zone = zone_name
                    break


            # Display assigned zone
            cv2.putText(
                frame,
                person_zone,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0,255,255),
                2
            )


            # Bounding box
            cv2.rectangle(
                frame,
                (x1,y1),
                (x2,y2),
                (0,255,0),
                2
            )



    # -----------------------------
    # Occupancy Calculation
    # -----------------------------
    occupancy = (total_people / TOTAL_SEATS) * 100



    # -----------------------------
    # Send Data To Backend
    # -----------------------------
    current_time = time.time()


    if current_time - last_sent_time >= 1:

        data = {
            "room": "Seminar Hall",
            "people_count": total_people
        }


        try:

            response = requests.post(
                API_URL,
                json=data,
                headers={
                    "Content-Type": "application/json"
                }
            )


            if response.status_code == 200:

                print(
                    "Occupancy sent:",
                    data
                )

            else:

                print(
                    "Backend error:",
                    response.status_code
                )


        except Exception as e:

            print(
                "API connection failed:",
                e
            )


        last_sent_time = current_time



    # -----------------------------
    # Display Counts
    # -----------------------------
    y = 40


    for zone, count in zone_counts.items():

        cv2.putText(
            frame,
            f"{zone}: {count}",
            (20,y),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,255,0),
            2
        )

        y += 40



    cv2.putText(
        frame,
        f"Total People: {total_people}",
        (20,y+20),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0,255,0),
        2
    )


    cv2.putText(
        frame,
        f"Occupancy: {occupancy:.1f}%",
        (20,y+60),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0,255,0),
        2
    )


    cv2.imshow(
        "Hall Detection",
        frame
    )


    if cv2.waitKey(1) & 0xFF == ord("q"):
        break



cap.release()
cv2.destroyAllWindows()