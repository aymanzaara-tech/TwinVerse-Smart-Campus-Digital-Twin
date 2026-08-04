import { useState, useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { trendSeries, trendDay } from "@/data/mockSensors";

const SERIES = [
  { key: "temperature", label: "Temperature", color: "#38bdf8", axis: "temp", unit: "°C" },
  { key: "occupancy", label: "Occupancy", color: "#a78bfa", axis: "people", unit: "" },
];

const RANGES = [
  { id: "1h", label: "1H", data: trendSeries.slice(-4) },
  { id: "6h", label: "6H", data: trendSeries },
  { id: "24h", label: "24H", data: trendDay },
];

/** Glass tooltip matching the dashboard theme */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-sidebar/95 p-3 shadow-2xl backdrop-blur-md text-xs">
      <p className="mb-1 font-semibold text-ink-faint">{label}</p>
      {payload.map((p) => {
        const s = SERIES.find((x) => x.key === p.dataKey);
        if (!s) return null;
        return (
          <p key={p.dataKey} className="flex items-center gap-2 text-ink-dim mt-0.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="text-ink-faint">{s.label}:</span>
            <span className="font-mono font-bold text-ink">{p.value}{s.unit && ` ${s.unit}`}</span>
          </p>
        );
      })}
    </div>
  );
}

/**
 * Real-Time Trends card (Section 6 - Dashboard)
 */
export default function TrendChart() {
  const [range, setRange] = useState("6h");
  const [hidden, setHidden] = useState([]); // hidden series keys

  const data = useMemo(() => {
    const raw = RANGES.find((r) => r.id === range)?.data || trendSeries;
    return raw.map((d) => ({
      time: d.time || "00:00",
      temperature: d.temperature ?? 0,
      occupancy: d.occupancy ?? 0,
    }));
  }, [range]);

  const toggle = (key) =>
    setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      className="card flex flex-col p-5"
    >
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Real-Time Trends</h3>
          <p className="text-xs text-ink-faint">
            {range === "24h" ? "Last 24 Hours" : range === "6h" ? "Last 6 Hours" : "Last Hour"}
          </p>
        </div>
        {/* Time range selector */}
        <div className="flex rounded-lg border border-line bg-white/[0.03] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors
                ${range === r.id ? "bg-accent/20 text-accent border border-accent/30 font-semibold" : "text-ink-faint hover:text-ink"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend (click to toggle a series) */}
      <div className="mb-3 flex flex-wrap gap-3">
        {SERIES.map((s) => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className={`flex items-center gap-1.5 text-xs transition-opacity cursor-pointer
              ${hidden.includes(s.key) ? "opacity-35" : "opacity-100"} text-ink-dim hover:text-ink`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Explicit Height Container so ResponsiveContainer computes height > 0 */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              yAxisId="people"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis yAxisId="temp" hide domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
            {SERIES.map((s) =>
              hidden.includes(s.key) ? null : (
                <Line
                  key={s.key}
                  yAxisId={s.axis}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={{ fill: s.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
