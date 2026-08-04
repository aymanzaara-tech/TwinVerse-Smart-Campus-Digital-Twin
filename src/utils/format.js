// Small formatting helpers shared across the app

export const fmtNumber = (n) => {
  const value = Number(n);

  if (!Number.isFinite(value)) return "0";

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
};

export const fmtTrend = (t) => {
  const value = Number(t);

  if (!Number.isFinite(value)) return "0%";

  return `${value > 0 ? "+" : ""}${fmtNumber(value)}%`;
};

export const statusColor = {
  ok: "var(--color-ok)",
  info: "var(--color-accent)",
  warn: "var(--color-warn)",
  critical: "var(--color-crit)",
  violet: "var(--color-vio)",
};