import { motion } from "framer-motion";

/**
 * Animated circular gauge (0–100).
 * Used by GaugeCard and the Comfort Score breakdown.
 */
export default function CircularGauge({
  value,
  size = 110,
  stroke = 9,
  color = "var(--color-accent)",
  label,
  delay = 0,
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - Math.min(Math.max(value, 0), 100) / 100);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
          />
          {/* progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: target }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono font-bold" style={{ fontSize: size * 0.24, color }}>
            {value}
          </span>
        </div>
      </div>
      {label && <p className="text-xs text-ink-dim">{label}</p>}
    </div>
  );
}
