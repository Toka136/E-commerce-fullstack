"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Coupon } from "../types/coupons";
import { AddCouponModal } from "./CouponModals";
import { CouponsTable } from "./CouponsTable";

export function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const [addOpen, setAddOpen] = useState(false);
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h1 className="text-2xl font-bold text-on-surface">Coupons</h1><p className="text-sm text-on-surface-variant">Manage discount coupons</p></div>
      <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"><Plus className="h-4 w-4" />Add Coupon</button>
    </div>
    <CouponsTable coupons={coupons} />
    <AddCouponModal open={addOpen} onClose={() => setAddOpen(false)} />
  </div>;
}
