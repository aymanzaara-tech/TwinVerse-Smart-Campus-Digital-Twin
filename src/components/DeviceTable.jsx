import { motion } from "framer-motion";
import Sparkline from "@/components/ui/Sparkline";
import { devices } from "@/data/mockDevices";

/** Device Status table: name, ON badge, live power, mini activity graph. */
export default function DeviceTable() {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      className="card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Device Status</h3>
          <p className="text-xs text-ink-faint">Seminar Hall equipment · live</p>
        </div>
        <span className="rounded-full bg-ok/10 px-2.5 py-1 text-[11px] font-medium text-ok">
          {devices.length} / {devices.length} online
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-faint">
              <th className="pb-2 pr-4 font-medium">Device</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 pr-4 font-medium">Power</th>
              <th className="pb-2 pr-4 font-medium">Health</th>
              <th className="pb-2 font-medium">Activity</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id} className="border-b border-line/60 last:border-0">
                <td className="py-3 pr-4 font-medium">{d.name}</td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-1 text-[11px] font-semibold text-ok">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" /> ON
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-ink-dim">
                  {d.power} <span className="text-[11px] text-ink-faint">{d.unit}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full ${d.health >= 95 ? "bg-ok" : d.health >= 90 ? "bg-accent" : "bg-warn"}`}
                        style={{ width: `${d.health}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-ink-faint">{d.health}%</span>
                  </div>
                </td>
                <td className="py-3">
                  <Sparkline data={d.spark} width={90} height={26} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
