import { Flame, AlertTriangle, Info, Clock } from "lucide-react";

const STYLES = {
  critical: { Icon: Flame, chip: "bg-crit/10 text-crit", bar: "bg-crit" },
  warning: { Icon: AlertTriangle, chip: "bg-warn/10 text-warn", bar: "bg-warn" },
  info: { Icon: Info, chip: "bg-accent/10 text-accent", bar: "bg-accent" },
};

/** Single alert row: severity icon, title, description, timestamp. */
export default function AlertCard({ alert, showRecommendation = false }) {
  const { Icon, chip, bar } = STYLES[alert.severity] ?? STYLES.info;
  return (
    <div className="relative flex gap-3 overflow-hidden rounded-xl border border-line bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
      {/* severity edge bar */}
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${chip}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight">{alert.title}</p>
        <p className="mt-0.5 text-xs leading-snug text-ink-dim">{alert.description}</p>
        {showRecommendation && alert.recommendation && (
          <p className="mt-1 text-xs text-accent/90">→ {alert.recommendation}</p>
        )}
        <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-faint">
          <Clock size={10} /> {alert.time}
        </p>
      </div>
    </div>
  );
}
