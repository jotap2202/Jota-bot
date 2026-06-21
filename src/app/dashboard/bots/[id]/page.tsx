import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { getBotDetail } from "@/lib/bots";
import { usd, pct, pnlColor } from "@/lib/format";
import { EquityChart } from "@/components/EquityChart";
import { BotControls } from "@/components/BotControls";
import { GridVisual } from "@/components/GridVisual";
import { AutoRefresh } from "@/components/AutoRefresh";
import { EditBot } from "@/components/EditBot";

export default async function BotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const { id } = await params;
  const detail = await getBotDetail(userId, id);
  if (!detail) notFound();

  const { bot, sim, curve } = detail;
  const pnlPct = bot.invested ? (sim.totalPnl / bot.invested) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {bot.status === "running" && <AutoRefresh interval={8000} />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/bots" className="text-muted hover:text-foreground">←</Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${bot.status === "running" ? "bg-green" : "bg-muted"}`} />
              <h1 className="text-2xl font-bold">{bot.name}</h1>
            </div>
            <p className="text-sm text-muted tabular">
              {bot.pair} · {bot.grids} grids · {bot.leverage}x ·{" "}
              <span className="uppercase">{bot.mode}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <EditBot
            bot={{
              id: bot.id,
              name: bot.name,
              lowerPrice: bot.lowerPrice,
              upperPrice: bot.upperPrice,
              grids: bot.grids,
              invested: bot.invested,
              leverage: bot.leverage,
            }}
          />
          <BotControls id={bot.id} status={bot.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-border overflow-hidden">
        <Metric label="PNL TOTAL" value={usd(sim.totalPnl, { sign: true })} valueClass={pnlColor(sim.totalPnl)} sub={pct(pnlPct, { sign: true })} />
        <Metric label="REALIZED" value={usd(sim.realizedPnl, { sign: true })} valueClass={pnlColor(sim.realizedPnl)} />
        <Metric label="UNREALIZED" value={usd(sim.unrealizedPnl, { sign: true })} valueClass={pnlColor(sim.unrealizedPnl)} />
        <Metric label="POSICIÓN" value={usd(sim.positionNotional)} sub={`${sim.position.toFixed(4)} u`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-muted">EQUITY</div>
            <div className="text-sm tabular text-muted">
              Precio actual: <span className="text-foreground">${sim.currentPrice}</span>
            </div>
          </div>
          <div className="mt-2"><EquityChart data={curve} height={240} /></div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-muted">REJILLA</div>
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green" />Compra</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" />Venta</span>
            </div>
          </div>
          <div className="mt-2">
            <GridVisual
              lower={bot.lowerPrice}
              upper={bot.upperPrice}
              levels={sim.gridLevels}
              current={sim.currentPrice}
              height={240}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-5">
          <div className="text-xs font-semibold tracking-wide text-muted">CONFIG</div>
          <dl className="mt-3 text-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
            <Item k="Rango" v={`$${bot.lowerPrice} – $${bot.upperPrice}`} />
            <Item k="Grids" v={String(bot.grids)} />
            <Item k="Separación" v={`$${((bot.upperPrice - bot.lowerPrice) / bot.grids).toFixed(bot.lowerPrice < 1 ? 5 : 2)}`} />
            <Item k="Inversión" v={usd(bot.invested)} />
            <Item k="Apalancamiento" v={`${bot.leverage}x`} />
            <Item k="Capital efectivo" v={usd(bot.invested * bot.leverage)} />
            <Item k="Fills" v={String(sim.filledCount)} />
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 text-xs font-semibold tracking-wide text-muted bg-surface border-b border-border">
          ÚLTIMOS TRADES
        </div>
        {sim.trades.length === 0 && (
          <div className="px-5 py-8 text-center text-muted text-sm">Sin trades todavía</div>
        )}
        {sim.trades.map((tr, i) => (
          <div key={i} className="grid grid-cols-4 px-5 py-2.5 text-sm border-b border-border last:border-b-0 tabular">
            <span className={tr.side === "buy" ? "text-green" : "text-red"}>
              {tr.side === "buy" ? "COMPRA" : "VENTA"}
            </span>
            <span className="text-right text-muted">${tr.price}</span>
            <span className="text-right text-muted">{tr.qty.toFixed(4)}</span>
            <span className={`text-right ${tr.pnl ? pnlColor(tr.pnl) : "text-muted"}`}>
              {tr.pnl ? usd(tr.pnl, { sign: true }) : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, sub, valueClass = "" }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="bg-surface p-5 border-r border-b border-border last:border-r-0">
      <div className="text-xs font-semibold tracking-wide text-muted">{label}</div>
      <div className={`text-xl font-bold mt-2 tabular ${valueClass}`}>{value}</div>
      {sub && <div className="text-xs mt-1 tabular text-muted">{sub}</div>}
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular">{v}</dd>
    </div>
  );
}
