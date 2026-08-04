import { motion } from "framer-motion";
import { Zap, Timer, HeartPulse } from "lucide-react";
import Sparkline from "@/components/ui/Sparkline";

/** Device Monitoring card: power, runtime, health + activity line. */
export default function DeviceCard({ device }) {
  const healthColor =
    device.health >= 95 ? "var(--color-ok)" : device.health >= 90 ? "var(--color-accent)" : "var(--color-warn)";
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{device.name}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-1 text-[11px] font-semibold text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> ON
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { Icon: Zap, label: "Power", value: `${device.power} ${device.unit}` },
          { Icon: Timer, label: "Runtime", value: `${device.runtimeHrs} h` },
          { Icon: HeartPulse, label: "Health", value: `${device.health}%` },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-white/[0.03] px-1 py-2.5">
            <Icon size={14} className="mx-auto text-accent" />
            <dd className="mt-1 font-mono text-xs font-semibold">{value}</dd>
            <dt className="text-[10px] text-ink-faint">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-faint">Activity</span>
        <Sparkline data={device.spark} width={110} height={26} />
      </div>

      {/* health bar */}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${device.health}%`, background: healthColor }} />
      </div>
    </motion.div>
  );
}
