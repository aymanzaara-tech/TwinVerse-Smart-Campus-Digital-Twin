// -------------------------------------------------------------
// Historical sensor log for the History page.
// Deterministic generator (no Math.random) so every refresh —
// and every screenshot in the project report — looks identical.
// -------------------------------------------------------------
const wave = (i, base, amp, period, digits = 1) =>
  +(base + amp * Math.sin((i / period) * Math.PI * 2)).toFixed(digits);

export const historyRows = Array.from({ length: 48 }, (_, i) => {
  const d = new Date(2025, 10, 14, 8, 0); // Nov 14 2025, 08:00
  d.setMinutes(d.getMinutes() + i * 30);
  const occupied = Math.max(0, Math.round(wave(i, 45, 45, 16, 0)));
  return {
    id: i + 1,
    timestamp: d.toISOString(),
    time: d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    temperature: wave(i, 28, 2.2, 12),
    humidity: Math.round(wave(i, 56, 6, 10, 0)),
    co2: Math.round(wave(i, 600, 140, 14, 0)),
    occupancy: occupied,
    power: wave(i, 4, 2.6, 16),
    comfort: Math.round(wave(i, 80, 9, 18, 0)),
  };
});
