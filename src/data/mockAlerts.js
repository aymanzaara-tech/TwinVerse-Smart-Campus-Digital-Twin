// Recent alerts, newest first. severity: "critical" | "warning" | "info"
export const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "High Occupancy",
    description: "Seminar Hall at 92 of 120 seats — approaching capacity limit.",
    time: "11:24 AM",
    recommendation: "Open rear ventilation and enable AC-2 boost mode.",
  },
  {
    id: 2,
    severity: "warning",
    title: "Temperature Rising",
    description: "Room temperature crossed 29 °C during peak occupancy.",
    time: "11:02 AM",
    recommendation: "Lower AC-1 setpoint by 1 °C for the next hour.",
  },
  {
    id: 3,
    severity: "info",
    title: "AC Performance",
    description: "AC-2 efficiency dropped 4% compared to last week.",
    time: "09:40 AM",
    recommendation: "Schedule filter cleaning within the next 7 days.",
  },
];
