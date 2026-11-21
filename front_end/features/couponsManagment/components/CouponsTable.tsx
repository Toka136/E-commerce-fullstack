"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Coupon } from "../types/coupons";
import { EditCouponModal } from "./CouponModals";
import { CouponActions } from "./CouponActions";

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
  return <>
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      <table className="w-full border-collapse text-left">
        <thead className="bg-surface-container-low/50"><tr>
          {["Code", "Discount", "Valid dates", "Usage", "Status", "Actions"].map((heading) => <th key={heading} className="border-b border-outline-variant/20 px-5 py-4 text-sm font-semibold text-on-surface-variant">{heading}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-outline-variant/10">
          {coupons.map((coupon) => <tr key={coupon.id} className="hover:bg-surface-container-low/30">
            <td className="px-5 py-4 font-semibold text-on-surface">{coupon.code}</td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{coupon.type === "PERCENTAGE" ? `${coupon.discount}%` : coupon.discount} <span className="uppercase">{coupon.type === "FIXED" ? "fixed" : ""}</span></td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{new Date(coupon.startDate).toLocaleDateString()} – {new Date(coupon.endDate).toLocaleDateString()}</td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{coupon.useCount}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${coupon.isActive ? "bg-green-100 text-green-800" : "bg-surface-container-high text-on-surface-variant"}`}>{coupon.isActive ? "Active" : "Inactive"}</span></td>
            <td className="px-5 py-4"><div className="flex min-w-[245px] items-center justify-end gap-2">
              <button type="button" onClick={() => setCouponToEdit(coupon)} disabled={coupon.useCount > 0} title={coupon.useCount > 0 ? "Used coupons cannot be edited" : "Edit coupon"} className="rounded-lg p-2 text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"><Pencil className="h-5 w-5" /></button>
              <CouponActions id={coupon.id} code={coupon.code} isActive={coupon.isActive} useCount={coupon.useCount} />
            </div></td>
          </tr>)}
          {coupons.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-on-surface-variant">No coupons found.</td></tr>}
        </tbody>
      </table>
      <div className="border-t border-outline-variant/20 px-6 py-4 text-sm text-on-surface-variant">Showing {coupons.length} coupons</div>
    </div>
    {couponToEdit && <EditCouponModal open onClose={() => setCouponToEdit(null)} coupon={couponToEdit} />}
  </>;
}
