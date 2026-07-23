import cv2

cap = cv2.VideoCapture("seminar_hall.mp4")

# Skip the first 100 frames
for i in range(100):
    ret, frame = cap.read()
    if not ret:
        break

if ret:
    cv2.imwrite("hall_frame.jpg", frame)
    print("Frame saved as hall_frame.jpg")

cap.release()