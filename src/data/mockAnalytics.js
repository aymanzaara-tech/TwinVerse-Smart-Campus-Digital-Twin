// Aggregated series + occupancy heatmap for the Analytics page
export const dailySeries = [
  { label: "Mon", occupancy: 68, energy: 11.2, comfort: 81 },
  { label: "Tue", occupancy: 74, energy: 12.1, comfort: 79 },
  { label: "Wed", occupancy: 81, energy: 13.4, comfort: 76 },
  { label: "Thu", occupancy: 77, energy: 12.8, comfort: 78 },
  { label: "Fri", occupancy: 85, energy: 13.9, comfort: 74 },
  { label: "Sat", occupancy: 32, energy: 6.1,  comfort: 88 },
  { label: "Sun", occupancy: 12, energy: 3.2,  comfort: 91 },
];

export const weeklySeries = [
  { label: "W1", occupancy: 71, energy: 78,  comfort: 80 },
  { label: "W2", occupancy: 76, energy: 84,  comfort: 78 },
  { label: "W3", occupancy: 69, energy: 74,  comfort: 82 },
  { label: "W4", occupancy: 82, energy: 91,  comfort: 75 },
];

export const monthlySeries = [
  { label: "Jul", occupancy: 64, energy: 310, comfort: 82 },
  { label: "Aug", occupancy: 72, energy: 342, comfort: 80 },
  { label: "Sep", occupancy: 78, energy: 361, comfort: 77 },
  { label: "Oct", occupancy: 74, energy: 348, comfort: 79 },
  { label: "Nov", occupancy: 80, energy: 366, comfort: 76 },
];

// Occupancy % heatmap: 6 weekdays × 10 hours (08:00 → 17:00)
export const heatmapHours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"];
export const heatmap = [
  { day: "Mon", values: [10, 42, 78, 92, 70, 35, 60, 82, 55, 20] },
  { day: "Tue", values: [14, 50, 84, 95, 74, 30, 66, 88, 61, 24] },
  { day: "Wed", values: [12, 46, 90, 97, 80, 38, 72, 91, 66, 28] },
  { day: "Thu", values: [9,  40, 74, 89, 68, 32, 58, 79, 52, 18] },
  { day: "Fri", values: [16, 55, 88, 96, 82, 41, 75, 93, 70, 30] },
  { day: "Sat", values: [4,  12, 25, 34, 28, 15, 18, 22, 10, 5] },
];
