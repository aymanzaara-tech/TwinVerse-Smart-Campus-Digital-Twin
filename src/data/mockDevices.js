// Device inventory + live status for the Seminar Hall
export const devices = [
  { id: "ac-1",  name: "AC-1",         status: "on", power: 1.8, unit: "kW", health: 96, runtimeHrs: 5.2, spark: [1.2, 1.4, 1.7, 1.8, 1.8, 1.9, 1.8] },
  { id: "ac-2",  name: "AC-2",         status: "on", power: 1.6, unit: "kW", health: 91, runtimeHrs: 5.2, spark: [1.1, 1.3, 1.5, 1.6, 1.7, 1.6, 1.6] },
  { id: "light", name: "Lights",       status: "on", power: 0.6, unit: "kW", health: 99, runtimeHrs: 6.0, spark: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] },
  { id: "proj",  name: "Projector",    status: "on", power: 0.4, unit: "kW", health: 88, runtimeHrs: 3.1, spark: [0, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4] },
  { id: "fans",  name: "Ceiling Fans", status: "on", power: 0.3, unit: "kW", health: 97, runtimeHrs: 6.0, spark: [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3] },
];
