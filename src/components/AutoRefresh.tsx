"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Soft-refreshes the current server route on an interval so live data (equity,
// PNL, prices) updates without a full reload or losing client state.
export function AutoRefresh({ interval = 10000 }: { interval?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), interval);
    return () => clearInterval(id);
  }, [router, interval]);
  return null;
}
