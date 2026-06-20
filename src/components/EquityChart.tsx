"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

export function EquityChart({
  data,
  height = 220,
}: {
  data: { t: number; equity: number }[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-muted text-sm"
      >
        Aún no hay historial
      </div>
    );
  }

  const values = data.map((d) => d.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const up = values[values.length - 1] >= values[0];
  const color = up ? "#3dd68c" : "#f2555a";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[min * 0.998, max * 1.002]} hide />
        <Tooltip
          contentStyle={{
            background: "#0f1a2e",
            border: "1px solid #1e2c47",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(t) => new Date((t as number) * 1000).toLocaleString()}
          formatter={(v) => [`$${(v as number).toFixed(2)}`, "Equity"]}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={color}
          strokeWidth={2}
          fill="url(#eq)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
