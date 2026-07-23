import cv2

points = []
zone_name = "Zone_B"


def mouse_click(event, x, y, flags, param):
    global frame

    if event == cv2.EVENT_LBUTTONDOWN:

        # Allow only 4 points
        if len(points) < 4:

            points.append((x, y))
            print("Point added:", (x, y))

            # Draw red point
            cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)

            # Draw blue lines between points
            if len(points) > 1:
                cv2.line(
                    frame,
                    points[-2],
                    points[-1],
                    (255, 0, 0),
                    2
                )

            # Close polygon after 4 points
            if len(points) == 4:
                cv2.line(
                    frame,
                    points[-1],
                    points[0],
                    (255, 0, 0),
                    2
                )
                print(f"{zone_name} completed!")

            cv2.imshow("Calibration", frame)


# Load video
cap = cv2.VideoCapture("seminar_hall.mp4")

ret, frame = cap.read()

if not ret:
    print("Could not read video")
    exit()


# Skip black intro frames
for _ in range(100):
    ret, frame = cap.read()

    if not ret:
        break


# Create OpenCV window
cv2.namedWindow("Calibration")

# Attach mouse callback
cv2.setMouseCallback("Calibration", mouse_click)


cv2.imshow("Calibration", frame)


print(f"Click the four corners of {zone_name}.")
print("Order:")
print("1. Top-left")
print("2. Top-right")
print("3. Bottom-right")
print("4. Bottom-left")
print("Press q when finished.")


while True:

    cv2.imshow("Calibration", frame)

    key = cv2.waitKey(1)

    if key == ord("q"):
        break


cv2.destroyAllWindows()
cap.release()


print("\n" + zone_name + " Coordinates:")
print(points)