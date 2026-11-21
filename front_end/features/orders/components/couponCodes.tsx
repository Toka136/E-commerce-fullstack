"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { useApplyCoupon } from "@/features/cart/hooks/useApplyCoupon";
import { useRemoveCoupon } from "@/features/cart/hooks/useRemoveCoupon";
import { ErrorFormate } from "@/features/cart/utils/errorFormate";
import { useRouter } from "next/navigation";

interface CouponCodeProps {
  
  appliedCoupon?: string;
}

export default function CouponCode({ appliedCoupon }: CouponCodeProps) {
  const [code, setCode] =  useState((appliedCoupon)?appliedCoupon:"");
   const {mutateAsync:applyCoupon,isPending:applyCouponPending,error:applyCouponError}=useApplyCoupon()
  const {mutateAsync:removeCoupon,isPending:removeCouponPending,error:removeCouponError}=useRemoveCoupon()
  const router = useRouter();
   const handleApplyCoupon = async (couponCode: string) => {
    await applyCoupon(couponCode);
    router.refresh();
  };
   const Remove = async (couponCode: string) => {
    await removeCoupon(couponCode);
    router.refresh();
  };

  console.log("appliedCoupon",appliedCoupon)
  useEffect(() => {
  setCode(appliedCoupon ?? "");
}, [appliedCoupon])

  const handleApply = () => {
    if (!code.trim()) return;
    handleApplyCoupon(code.trim());
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
          {...(appliedCoupon && { readOnly: true })}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code here"
          className="w-full min-w-0 flex-1 rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
       {
        appliedCoupon?
         <button
          type="button"
          disabled={removeCouponPending}
          onClick={()=>Remove(code)}
          className="shrink-0 rounded-lg bg-red-700 px-5 text-sm font-medium text-on-secondary transition hover:opacity-90 disabled:opacity-50"
        >
          {removeCouponPending ? "..." : "Remove"}
        </button>:
         <button
          type="button"
          onClick={handleApply}
          disabled={applyCouponPending || !code.trim()}
          className="shrink-0 rounded-lg bg-secondary px-5 text-sm font-medium text-on-secondary transition hover:opacity-90 disabled:opacity-50"
        >
          {applyCouponPending ? "..." : "Apply"}
        </button>
       }
      </div>
      {applyCouponError && (
      <p className="text-red-500 text-sm">
        {ErrorFormate({ error: applyCouponError })}
      </p>
    )}
    {removeCouponError && (
    <p className="text-red-500 text-sm">
      {ErrorFormate({ error: removeCouponError })}
    </p>
  )}
    </section>
  );
}