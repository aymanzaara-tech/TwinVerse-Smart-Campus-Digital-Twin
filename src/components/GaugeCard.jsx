import { motion } from "framer-motion";
import CircularGauge from "@/components/ui/CircularGauge";

/** First-row card variant with a circular gauge instead of a value+sparkline. */
export default function GaugeCard({ label, value, color, subtitle, delay = 0 }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px -12px ${color}55` }}
      transition={{ duration: 0.25 }}
      className="card flex flex-col items-center justify-center p-4"
    >
      <CircularGauge value={value} size={92} stroke={8} color={color} delay={delay} />
      <p className="mt-2 text-xs font-medium text-ink-dim">{label}</p>
      {subtitle && <p className="text-[11px] text-ink-faint">{subtitle}</p>}
    </motion.div>
  );
}
