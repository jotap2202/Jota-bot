"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };
type ToastCtx = { toast: (message: string, type?: Toast["type"]) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur animate-[slideIn_.2s_ease] ${
              t.type === "success"
                ? "bg-green/15 border-green/40 text-green"
                : t.type === "error"
                ? "bg-red/15 border-red/40 text-red"
                : "bg-surface border-border text-foreground"
            }`}
          >
            {t.type === "success" ? "✓ " : t.type === "error" ? "✕ " : "ℹ "}
            {t.message}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </Ctx.Provider>
  );
}
