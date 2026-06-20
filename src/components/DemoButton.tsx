"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DemoButton({
  className = "",
  children = "Probar la demo",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    await fetch("/api/auth/demo", { method: "POST" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button onClick={go} disabled={loading} className={className}>
      {loading ? "Cargando..." : children}
    </button>
  );
}
