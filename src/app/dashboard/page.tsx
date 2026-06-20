import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { getPortfolio, getPortfolioCurve } from "@/lib/bots";
import { usd, pct, pnlColor } from "@/lib/format";
import { EquityChart } from "@/components/EquityChart";

export default async function OverviewPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const portfolio = await getPortfolio(userId);
  const bots = portfolio.bots;
  const curve = await getPortfolioCurve(userId, bots);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-sm text-muted mt-1">
            {portfolio.botCount} bot{portfolio.botCount !== 1 && "s"} ·{" "}
            <span className="text-green">{portfolio.runningCount} running</span>
          </p>
        </div>
        <Link
          href="/dashboard/bots/new"
          className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors"
        >
          <span className="text-lg leading-none">+</span> New bot
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-border overflow-hidden">
        <Metric
          label="TOTAL EQUITY"
          value={usd(portfolio.totalEquity)}
          sub={
            <span className={pnlColor(portfolio.equityChangePct)}>
              {portfolio.equityChangePct < 0 ? "↓" : "↑"} {pct(portfolio.equityChangePct)}
            </span>
          }
        />
        <Metric label="TOTAL PNL" value={usd(portfolio.totalPnl, { sign: true })} valueClass={pnlColor(portfolio.totalPnl)} />
        <Metric label="REALIZED" value={usd(portfolio.realized, { sign: true })} valueClass={pnlColor(portfolio.realized)} />
        <Metric label="UNREALIZED" value={usd(portfolio.unrealized, { sign: true })} valueClass={pnlColor(portfolio.unrealized)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 rounded-xl border border-border overflow-hidden">
        <Metric label="POSITION NOTIONAL" value={usd(portfolio.positionNotional)} />
        <Metric label="INVESTED" value={usd(portfolio.invested)} />
        <Metric label="AVG LEVERAGE" value={`${portfolio.avgLeverage.toFixed(1)}x`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="PORTFOLIO EQUITY">
          <EquityChart data={curve} />
        </Card>
        <Card title="PAIR EXPOSURE">
          <div className="flex flex-col gap-4 pt-2">
            {portfolio.pairExposure.length === 0 && (
              <div className="text-muted text-sm py-8 text-center">Sin exposición abierta</div>
            )}
            {portfolio.pairExposure.map((p) => (
              <div key={p.pair}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gold-strong tabular">{p.pair}</span>
                  <span className="text-muted tabular">
                    {usd(p.notional)} · {p.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-gold-strong rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h2 className="text-sm font-semibold tracking-wide text-muted mt-2">BOTS</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        {bots.length === 0 && (
          <div className="px-5 py-10 text-center text-muted text-sm">
            Todavía no tenés bots.{" "}
            <Link href="/dashboard/bots/new" className="text-gold-strong hover:underline">
              Creá el primero
            </Link>
          </div>
        )}
        {bots.map((b) => (
          <Link
            key={b.id}
            href={`/dashboard/bots/${b.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-surface/50 transition-colors border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full ${b.status === "running" ? "bg-green" : "bg-muted"}`} />
              <div>
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-muted tabular">{b.pair}</div>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div className="text-right hidden sm:block">
                <div className="text-muted text-xs">Invested</div>
                <div className="tabular">{usd(b.invested)}</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-muted text-xs">Leverage</div>
                <div className="tabular">{b.leverage}x</div>
              </div>
              <div className="text-right w-24">
                <div className="text-muted text-xs">PNL</div>
                <div className={`tabular ${pnlColor(b.pnl)}`}>
                  {usd(b.pnl, { sign: true })}{" "}
                  <span className="text-xs">({pct(b.pnlPct, { sign: true })})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, sub, valueClass = "" }: { label: string; value: string; sub?: React.ReactNode; valueClass?: string }) {
  return (
    <div className="bg-surface p-5 border-r border-b border-border last:border-r-0">
      <div className="text-xs font-semibold tracking-wide text-muted">{label}</div>
      <div className={`text-2xl font-bold mt-2 tabular ${valueClass}`}>{value}</div>
      {sub && <div className="text-xs mt-1 tabular">{sub}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-xs font-semibold tracking-wide text-muted">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
