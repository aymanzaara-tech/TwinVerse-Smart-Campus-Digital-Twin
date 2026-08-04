import { motion } from "framer-motion";

export default function DecisionCard({
  icon: Icon,
  title,
  value,
  type = "default", // 'severity' | 'status' | 'default'
  delay = 0,
}) {
  const displayValue = value !== undefined && value !== null && value !== "" ? value : "--";

  function renderValue() {
    if (type === "severity") {
      // Strip emojis and trim whitespace
      const cleanText = String(displayValue)
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .trim()
        .toUpperCase();

      let style = "border-line bg-white/5 text-ink-dim";

      if (cleanText.includes("LOW") || cleanText.includes("GREEN")) {
        style = "border-ok/30 bg-ok/10 text-ok";
      } else if (cleanText.includes("MEDIUM") || cleanText.includes("MED") || cleanText.includes("YELLOW")) {
        style = "border-amber-500/30 bg-amber-500/10 text-amber-400";
      } else if (cleanText.includes("HIGH") || cleanText.includes("ORANGE")) {
        style = "border-orange-500/30 bg-orange-500/10 text-orange-400";
      } else if (cleanText.includes("CRITICAL") || cleanText.includes("CRIT") || cleanText.includes("RED")) {
        style = "border-crit/30 bg-crit/10 text-crit";
      }

      return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
          {cleanText || displayValue}
        </span>
      );
    }

    if (type === "status") {
      const str = String(displayValue).toUpperCase();
      let style = "border-line bg-white/5 text-ink-dim";
      if (str.includes("NORMAL") || str.includes("OPTIMAL") || str.includes("SATISFACTORY") || str.includes("OK")) {
        style = "border-ok/30 bg-ok/10 text-ok";
      } else if (str.includes("ATTENTION") || str.includes("WARN") || str.includes("COOLING")) {
        style = "border-warn/30 bg-warn/10 text-warn";
      } else if (str.includes("CRITICAL") || str.includes("HIGH")) {
        style = "border-crit/30 bg-crit/10 text-crit";
      }
      return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
          {displayValue}
        </span>
      );
    }

    return (
      <span className="font-mono text-base font-semibold text-ink">
        {displayValue}
      </span>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { delay, duration: 0.22 } },
      }}
      className="card flex flex-col justify-between p-3.5 transition-all duration-200 hover:border-line/80"
    >
      <div className="flex items-center gap-2 text-ink-dim">
        {Icon && <Icon size={16} className="text-accent shrink-0" />}
        <span className="text-xs font-medium text-ink-faint truncate">{title}</span>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        {renderValue()}
      </div>
    </motion.div>
  );
}
