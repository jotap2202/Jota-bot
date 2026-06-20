export function Topbar() {
  return (
    <header className="h-16 shrink-0 border-b border-border flex items-center justify-end gap-4 px-6">
      <span className="flex items-center gap-2 text-sm text-green">
        <span className="w-2 h-2 rounded-full bg-green" />
        Live
      </span>
      <div className="inline-flex rounded-lg overflow-hidden border border-border text-xs font-medium">
        <button className="px-2.5 py-1 bg-surface text-muted">ES</button>
        <button className="px-2.5 py-1 bg-gold-strong text-[#0a1020]">EN</button>
      </div>
      <button className="text-muted hover:text-foreground text-lg" aria-label="theme">
        ◑
      </button>
    </header>
  );
}
