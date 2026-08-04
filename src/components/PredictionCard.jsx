import { motion } from "framer-motion";

/**
 * Reusable card for AI Prediction Engine metrics.
 * Displays: Icon, Title, Value (with unit), and "ML Prediction" badge.
 */
export default function PredictionCard({
  icon: Icon,
  title,
  value,
  unit = "",
  color = "#38bdf8",
  delay = 0,
}) {
  const displayValue = value !== undefined && value !== null && value !== "" ? `${value}${unit ? ` ${unit}` : ""}` : "--";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { delay, duration: 0.25 } },
      }}
      className="card relative flex flex-col justify-between overflow-hidden p-4 transition-all duration-200 hover:border-accent/30"
    >
      {/* Top row: Icon + ML Prediction Badge */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03]"
          style={{ color }}
        >
          {Icon && <Icon size={18} />}
        </div>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
          ML Prediction
        </span>
      </div>

      {/* Metric details */}
      <div className="mt-3">
        <p className="text-xs font-medium text-ink-dim">{title}</p>
        <p className="mt-1 font-mono text-xl font-bold text-ink">
          {displayValue}
        </p>
      </div>

      {/* Decorative subtle accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
