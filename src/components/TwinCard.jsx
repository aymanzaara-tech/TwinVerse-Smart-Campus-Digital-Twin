import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rotate3d, ZoomIn, RefreshCw, Maximize2,
  AirVent, Lightbulb, Projector,
} from "lucide-react";
import { seatMap } from "@/data/mockSensors";

// Seat state colors
const COLORS = {
  occupied: "#38bdf8",
  reserved: "#fbbf24",
  empty: "rgba(255,255,255,0.08)",
};

/**
 * Deterministic seat states: same layout on every render/refresh.
 * Seats are hashed, sorted, and the first N become occupied /
 * reserved. Replace with real YOLOv8 detections later.
 */
function useSeatStates({ rows, cols, occupied, reserved }) {
  return useMemo(() => {
    const total = rows * cols;
    const order = Array.from({ length: total }, (_, i) => i).sort(
      (a, b) => ((a * 2654435761) % 97) - ((b * 2654435761) % 97)
    );
    const states = Array(total).fill("empty");
    order.slice(0, occupied).forEach((i) => (states[i] = "occupied"));
    order.slice(occupied, occupied + reserved).forEach((i) => (states[i] = "reserved"));
    return states;
  }, [rows, cols, occupied, reserved]);
}

/**
 * Seminar Hall Digital Twin card.
 * Today: an SVG top-down seat map driven by mock data, with
 * working Rotate (perspective tilt), Zoom, and Reset controls.
 * Later: the React Three Fiber model mounts in this same slot.
 */
export default function TwinCard() {
  const { rows, cols, occupied, reserved } = seatMap;
  const states = useSeatStates(seatMap);
  const empty = rows * cols - occupied - reserved;

  const [tilted, setTilted] = useState(false);
  const [zoom, setZoom] = useState(1);

  // --- SVG geometry ---
  const seatW = 30, seatH = 20, gapX = 8, gapY = 10, aisle = 34;
  const half = cols / 2;
  const width = cols * seatW + (cols - 2) * gapX + aisle + 40;
  const height = 84 + rows * (seatH + gapY) + 16;
  const seatX = (c) => 20 + c * (seatW + gapX) + (c >= half ? aisle - gapX : 0);
  const seatY = (r) => 84 + r * (seatH + gapY);

  const counts = [
    { label: "Occupied Seats", value: occupied, color: COLORS.occupied },
    { label: "Reserved Seats", value: reserved, color: COLORS.reserved },
    { label: "Empty Seats", value: empty, color: "rgba(255,255,255,0.35)" },
  ];
  const devices = [
    { label: "AC", Icon: AirVent },
    { label: "Lights", Icon: Lightbulb },
    { label: "Projector", Icon: Projector },
  ];
  const controls = [
    { label: "Rotate", Icon: Rotate3d, onClick: () => setTilted((t) => !t), active: tilted },
    { label: "Zoom", Icon: ZoomIn, onClick: () => setZoom((z) => Math.min(z + 0.2, 1.6)), active: zoom > 1 },
    { label: "Reset", Icon: RefreshCw, onClick: () => { setTilted(false); setZoom(1); } },
  ];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      className="card relative flex h-full flex-col overflow-hidden p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Seminar Hall — Digital Twin</h3>
          <p className="text-xs text-ink-faint">
            Live seat map · 3D model (Three.js) mounts here next
          </p>
        </div>
        {/* Device status badges */}
        <div className="flex gap-2">
          {devices.map(({ label, Icon }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-ok/20 bg-ok/10 px-2.5 py-1 text-[11px] font-medium text-ok"
            >
              <Icon size={12} /> {label} ON
            </span>
          ))}
        </div>
      </div>

      {/* Seat-count overlay chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {counts.map((c) => (
          <span
            key={c.label}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[11px] text-ink-dim"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label}
            <span className="font-mono font-semibold text-ink">{c.value}</span>
          </span>
        ))}
      </div>

      {/* ---- Hall visualization ---- */}
      <div className="mt-3 flex-1 overflow-hidden rounded-2xl border border-line bg-bg/60">
        <div
          className="grid h-full min-h-[280px] place-items-center transition-transform duration-500"
          style={{
            transform: `perspective(1100px) rotateX(${tilted ? 34 : 0}deg) scale(${zoom})`,
          }}
        >
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full p-3">
            {/* Screen */}
            <rect x={width / 2 - 130} y={16} width={260} height={10} rx={5}
              fill="url(#screenGrad)" />
            <text x={width / 2} y={46} textAnchor="middle" fontSize="11"
              fill="#64748b" fontFamily="Inter, sans-serif">
              PROJECTOR SCREEN
            </text>
            {/* Podium */}
            <rect x={30} y={40} width={44} height={26} rx={6}
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
            <defs>
              <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="1" stopColor="#38bdf8" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* Seats */}
            {states.map((state, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              return (
                <g key={i}>
                  <rect
                    x={seatX(c)} y={seatY(r)} width={seatW} height={seatH} rx={5}
                    fill={COLORS[state]}
                    stroke={state === "empty" ? "rgba(255,255,255,0.06)" : "none"}
                  >
                    <title>{`Seat R${r + 1}-${c + 1} · ${state}`}</title>
                  </rect>
                  {/* soft glow under occupied seats */}
                  {state === "occupied" && (
                    <rect
                      x={seatX(c)} y={seatY(r)} width={seatW} height={seatH} rx={5}
                      fill="none" stroke="#38bdf8" strokeOpacity="0.35"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* View controls + expand */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          {controls.map(({ label, Icon, onClick, active }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors
                ${active
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line bg-white/[0.03] text-ink-dim hover:bg-white/[0.06] hover:text-ink"}`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <Link
          to="/digital-twin"
          title="Open full twin view"
          className="rounded-lg border border-line bg-white/[0.03] p-2 text-ink-dim transition-colors hover:bg-white/[0.06] hover:text-accent"
        >
          <Maximize2 size={15} />
        </Link>
      </div>
    </motion.div>
  );
}
