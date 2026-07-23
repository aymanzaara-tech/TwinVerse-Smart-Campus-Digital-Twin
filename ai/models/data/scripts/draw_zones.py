import cv2
import numpy as np
from zones import zones


cap = cv2.VideoCapture("seminar_hall.mp4")

frame = None

# Skip black intro frames
for _ in range(100):
    ret, frame = cap.read()

    if not ret:
        print("Could not read video")
        exit()


# Copy frame
temp = frame.copy()


# Draw zones
for zone_name, points in zones.items():

    polygon = np.array(points, np.int32)

    cv2.polylines(
        temp,
        [polygon],
        True,
        (255, 0, 0),
        3
    )

    # Add zone label
    x, y = points[0]

    cv2.putText(
        temp,
        zone_name,
        (x, y - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2
    )


# Show result
cv2.imshow("Zone Calibration Check", temp)

print("Press any key to close")

cv2.waitKey(0)

cv2.destroyAllWindows()
cap.release()