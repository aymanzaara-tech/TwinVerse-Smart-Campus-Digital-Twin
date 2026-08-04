// -------------------------------------------------------------
// Firebase preparation (NOT active yet).
// 1) npm install firebase
// 2) Fill firebaseConfig from the Firebase console
// 3) Uncomment the initialization block
// The occupancy pipeline will be: Camera → YOLOv8 → Firebase
// Realtime DB → this listener → React state.
// -------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "twinverse.firebaseapp.com",
  databaseURL: "https://twinverse-default-rtdb.firebaseio.com",
  projectId: "twinverse",
  storageBucket: "twinverse.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, onValue } from "firebase/database";
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

/**
 * Subscribe to live occupancy pushed by the YOLOv8 pipeline.
 * Returns an unsubscribe function.
 */
export function listenToOccupancy(callback) {
  // const seatsRef = ref(db, "seminarHall/occupancy");
  // return onValue(seatsRef, (snap) => callback(snap.val()));
  console.warn("[firebase] not configured — using mock data");
  return () => {};
}

/** One-shot read helper (same pattern for other sensor nodes). */
export async function readNode(path) {
  // const snap = await get(ref(db, path));
  // return snap.val();
  console.warn(`[firebase] readNode("${path}") called before configuration`);
  return null;
}
