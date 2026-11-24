"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";

/** Re-checks the payment status every `interval` seconds and on click. */
export default function RefreshStatusButton({ interval = 10 }: { interval?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [left, setLeft] = useState(interval);

  const refresh = () => startTransition(() => router.refresh());

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          refresh();
          return interval;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => {
          setLeft(interval);
          refresh();
        }}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} aria-hidden />
        {isPending ? "Checking…" : `Check status (auto in ${left}s)`}
      </button>
    </div>
  );
}