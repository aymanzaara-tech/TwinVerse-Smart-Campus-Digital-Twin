import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "@/components/ui/Sparkline";
import { fmtTrend } from "@/utils/format";

/**
 * First-row statistic card: rounded icon, big value,
 * mini trend line, subtitle, and a trend chip.
 * `color` is a CSS color (theme var or hex).
 */
export default function StatCard({ icon: Icon, label, value, unit, trend, spark, color, subtitle }) {
  const up = trend >= 0;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px -12px ${color}55` }}
      transition={{ duration: 0.25 }}
      className="card p-4"
    >
      <div className="flex items-start justify-between">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
        >
          <Icon size={19} />
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium
            ${up ? "bg-ok/10 text-ok" : "bg-crit/10 text-crit"}`}
        >
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {fmtTrend(trend)}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold leading-none">
            {value}
            {unit && <span className="ml-1 text-sm font-medium text-ink-faint">{unit}</span>}
          </p>
          <p className="mt-1.5 truncate text-xs text-ink-dim">{label}</p>
          {subtitle && <p className="text-[11px] text-ink-faint">{subtitle}</p>}
        </div>
        <Sparkline data={spark} color={color} />
      </div>
    </motion.div>
  );
}
