/**
 * Tiny SVG trend line used inside StatCard and DeviceTable.
 * Lightweight on purpose — no chart library for something this small.
 */
export default function Sparkline({
  data,
  color = "var(--color-accent)",
  width = 72,
  height = 28,
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - 3 - ((v - min) / range) * (height - 6),
  ]);
  const line = pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={area} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* dot on the latest reading */}
      <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="2.4" fill={color} />
    </svg>
  );
}
