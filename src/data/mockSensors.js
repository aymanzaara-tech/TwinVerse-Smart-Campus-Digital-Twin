// -------------------------------------------------------------
// Mock sensor data for the Seminar Hall.
// Later this will be replaced by the FastAPI / Firebase service
// layer in src/services — keep the shapes identical there.
// -------------------------------------------------------------

// Section 1: Live Environment metrics
export const liveStats = {
  outdoorTemperature: 29.4,
  outdoorHumidity: 55,
  peopleCount: 42,
  outdoorTempTrend: "Rising",
  room: "Seminar Hall",
};

// Section 2: AI Prediction Engine metrics
export const predictions = {
  predictedIndoorTemp: 24.5,
  predictedIndoorHumidity: 52,
  predictedComfortScore: 84,
  predictedLearningQuality: 88,
  predictedCoolingDemand: "3.2 kW",
};

// Section 3: AI Decision Engine metrics
export const decisions = {
  tempTrend: "Rising",
  highOccupancy: "No (42/120)",
  energyWaste: "Low",
  alertSeverity: "Yellow",
  aiConfidence: "94%",
  overallRoomStatus: "Optimal",
};

// Section 4: Recommendations
export const recommendations = {
  coolingDemand: "Increase AC cooling output by 1.5°C before peak 14:00 thermal load.",
  energy: "Enable eco-ventilation mode to optimize energy efficiency by 14%.",
  maintenance: "Inspect HVAC Unit #2 filter due for routine cleaning within 5 days.",
};

// Last 6 hours, 30-min intervals — used by the Real-Time Trends chart
export const trendSeries = [
  { time: "09:00", temperature: 26.1, occupancy: 8 },
  { time: "09:30", temperature: 26.8, occupancy: 22 },
  { time: "10:00", temperature: 27.5, occupancy: 65 },
  { time: "10:30", temperature: 28.2, occupancy: 88 },
  { time: "11:00", temperature: 28.9, occupancy: 92 },
  { time: "11:30", temperature: 29.6, occupancy: 90 },
  { time: "12:00", temperature: 29.9, occupancy: 74 },
  { time: "12:30", temperature: 29.2, occupancy: 31 },
  { time: "13:00", temperature: 28.6, occupancy: 18 },
  { time: "13:30", temperature: 28.8, occupancy: 40 },
  { time: "14:00", temperature: 29.1, occupancy: 55 },
  { time: "14:30", temperature: 29.4, occupancy: 42 },
];

// Last 24 hours, hourly — used when the "24H" range is selected
export const trendDay = [
  { time: "15:00", temperature: 29.8, occupancy: 61 },
  { time: "17:00", temperature: 28.9, occupancy: 25 },
  { time: "19:00", temperature: 27.6, occupancy: 6 },
  { time: "21:00", temperature: 26.8, occupancy: 0 },
  { time: "23:00", temperature: 26.1, occupancy: 0 },
  { time: "01:00", temperature: 25.6, occupancy: 0 },
  { time: "03:00", temperature: 25.2, occupancy: 0 },
  { time: "05:00", temperature: 25.0, occupancy: 0 },
  { time: "07:00", temperature: 25.7, occupancy: 3 },
  { time: "09:00", temperature: 26.1, occupancy: 8 },
  { time: "11:00", temperature: 28.9, occupancy: 92 },
  { time: "13:00", temperature: 28.6, occupancy: 18 },
  { time: "14:30", temperature: 29.4, occupancy: 42 },
];

// Seat map for the digital twin card (12 columns × 10 rows = 120 seats)
export const seatMap = { rows: 10, cols: 12, occupied: 42, reserved: 8 };
