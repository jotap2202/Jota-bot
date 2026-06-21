// Visual ladder of grid levels: buy orders below the current price, sell orders
// above, with the live price highlighted. Pure SVG, no client JS needed.

export function GridVisual({
  lower,
  upper,
  levels,
  current,
  height = 280,
}: {
  lower: number;
  upper: number;
  levels: number[];
  current: number;
  height?: number;
}) {
  const pad = 14;
  const h = height;
  const top = pad;
  const bottom = h - pad;
  const span = upper - lower || 1;
  const y = (price: number) => bottom - ((price - lower) / span) * (bottom - top);
  const fmt = (p: number) => (p < 1 ? p.toFixed(5) : p.toLocaleString("en-US", { maximumFractionDigits: 2 }));

  const clampedCurrent = Math.max(lower, Math.min(upper, current));
  const cy = y(clampedCurrent);

  return (
    <svg width="100%" height={h} viewBox={`0 0 320 ${h}`} preserveAspectRatio="none" className="overflow-visible">
      {/* track */}
      <line x1="160" y1={top} x2="160" y2={bottom} stroke="#2e2230" strokeWidth="1" />

      {levels.map((lvl, i) => {
        const ly = y(lvl);
        const isBuy = lvl < current;
        const color = isBuy ? "#3dd68c" : "#ec4899";
        return (
          <g key={i}>
            <line x1="120" y1={ly} x2="200" y2={ly} stroke={color} strokeWidth="1" opacity="0.5" />
            <circle cx="160" cy={ly} r="2.5" fill={color} />
          </g>
        );
      })}

      {/* current price band */}
      <line x1="40" y1={cy} x2="280" y2={cy} stroke="#f7eef4" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="206" y={cy - 9} width="74" height="18" rx="4" fill="#f7eef4" />
      <text x="243" y={cy + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0a070a">
        {fmt(current)}
      </text>

      {/* bounds labels */}
      <text x="40" y={top + 4} fontSize="9" fill="#9c8b97">{fmt(upper)}</text>
      <text x="40" y={bottom} fontSize="9" fill="#9c8b97">{fmt(lower)}</text>
    </svg>
  );
}
