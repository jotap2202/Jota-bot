import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { getBots } from "@/lib/bots";
import { usd, pct, pnlColor } from "@/lib/format";

export default async function BotsPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const bots = await getBots(userId);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bots</h1>
        <Link
          href="/dashboard/bots/new"
          className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors"
        >
          <span className="text-lg leading-none">+</span> New bot
        </Link>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold tracking-wide text-muted bg-surface border-b border-border">
          <div className="col-span-4">BOT</div>
          <div className="col-span-2 text-right">INVESTED</div>
          <div className="col-span-2 text-right">LEVERAGE</div>
          <div className="col-span-2 text-right">FILLS</div>
          <div className="col-span-2 text-right">PNL</div>
        </div>
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
            className="grid grid-cols-12 items-center px-5 py-4 hover:bg-surface/50 transition-colors border-b border-border last:border-b-0"
          >
            <div className="col-span-4 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${b.status === "running" ? "bg-green" : "bg-muted"}`} />
              <div>
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-muted tabular">{b.pair} · {b.grids} grids</div>
              </div>
            </div>
            <div className="col-span-2 text-right tabular">{usd(b.invested)}</div>
            <div className="col-span-2 text-right tabular">{b.leverage}x</div>
            <div className="col-span-2 text-right tabular text-muted">{b.filledCount}</div>
            <div className={`col-span-2 text-right tabular ${pnlColor(b.pnl)}`}>
              {usd(b.pnl, { sign: true })}
              <div className="text-xs">{pct(b.pnlPct, { sign: true })}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
