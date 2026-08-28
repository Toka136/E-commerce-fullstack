"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

interface CouponCodeProps {
  onApply: (code: string) => void;
  isApplying?: boolean;
}

export default function CouponCode({ onApply, isApplying }: CouponCodeProps) {
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    onApply(code.trim());
  };

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Coupon Code
        </h2>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code here"
          className="w-full min-w-0 flex-1 rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className="shrink-0 rounded-lg bg-secondary px-5 text-sm font-medium text-on-secondary transition hover:opacity-90 disabled:opacity-50"
        >
          {isApplying ? "..." : "Apply"}
        </button>
      </div>
    </section>
  );
}