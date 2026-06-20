"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/bots", label: "Bots", icon: "◎" },
  { href: "/dashboard/backtest", label: "Backtest", icon: "🛡" },
  { href: "/dashboard/market", label: "Market", icon: "📈" },
  { href: "/dashboard/arbitrage", label: "Arbitrage", icon: "⇄" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-background flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <Logo size={28} />
        <span className="font-bold tracking-wide">JOTA BOT</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-surface text-foreground border border-border"
                  : "text-muted hover:text-foreground hover:bg-surface/50"
              }`}
            >
              <span className="w-4 text-center opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
