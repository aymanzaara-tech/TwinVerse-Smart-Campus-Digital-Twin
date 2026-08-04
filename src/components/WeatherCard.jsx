import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, Leaf } from "lucide-react";
import Sparkline from "@/components/ui/Sparkline";

const ICONS = { temperature: Thermometer, humidity: Droplets, co2: Leaf, wind: Wind };

/** Environment page metric card (outdoor/indoor reading). */
export default function WeatherCard({ metric, spark, color = "#38bdf8" }) {
  const Icon = ICONS[metric.key] ?? Thermometer;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      className="card p-4"
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-xl"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
      >
        <Icon size={19} />
      </span>
      <p className="mt-3 font-mono text-2xl font-bold leading-none">
        {metric.value}
        <span className="ml-1 text-sm font-medium text-ink-faint">{metric.unit}</span>
      </p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-xs text-ink-dim">{metric.label}</p>
        {spark && <Sparkline data={spark} color={color} width={64} height={24} />}
      </div>
    </motion.div>
  );
}
