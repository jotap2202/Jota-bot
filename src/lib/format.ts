export function usd(n: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && n > 0 ? "+" : n < 0 ? "-" : "";
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${abs}`;
}

export function pct(n: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function pnlColor(n: number): string {
  if (n > 0) return "text-green";
  if (n < 0) return "text-red";
  return "text-foreground";
}
