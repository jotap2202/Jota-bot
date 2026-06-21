"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { ToastProvider } from "./ToastProvider";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/bots", label: "Bots", icon: "◎" },
  { href: "/dashboard/backtest", label: "Backtest", icon: "🛡" },
  { href: "/dashboard/market", label: "Market", icon: "📈" },
  { href: "/dashboard/arbitrage", label: "Arbitrage", icon: "⇄" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="flex-1 p-3 flex flex-col gap-1">
      {nav.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: { email: string; name: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-background flex-col">
          <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
            <Logo size={28} />
            <span className="font-bold tracking-wide">JOTA BOT</span>
          </div>
          <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col">
              <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
                <Logo size={28} />
                <span className="font-bold tracking-wide">JOTA BOT</span>
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-16 shrink-0 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-6">
            <button
              className="md:hidden text-foreground text-xl"
              onClick={() => setMobileOpen(true)}
              aria-label="Menú"
            >
              ☰
            </button>
            <div className="flex-1" />
            <span className="flex items-center gap-2 text-sm text-green">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" /> Live
            </span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm hover:bg-surface transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-gold/20 text-gold-strong grid place-items-center text-xs font-bold">
                  {(user.name || user.email)[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline max-w-[140px] truncate text-muted">{user.email}</span>
                <span className="text-muted text-xs">▾</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-surface shadow-xl z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-medium truncate">{user.name || "Mi cuenta"}</div>
                      <div className="text-xs text-muted truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-colors"
                    >
                      ⚙ Ajustes
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-sm text-muted hover:text-red hover:bg-background transition-colors"
                    >
                      ⏻ Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
