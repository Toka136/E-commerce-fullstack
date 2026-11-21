import { useState } from "react";
import { UseActivateCoupon, UseDeactivateCoupon, UseDeleteCoupon } from "../hooks/useCouponMutations";

export function CouponActions({ id, code, isActive, useCount }: { id: string; code: string; isActive: boolean; useCount: number }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const activate = UseActivateCoupon();
  const deactivate = UseDeactivateCoupon();
  const remove = UseDeleteCoupon();

  const runDelete = async () => {
    await remove.mutateAsync(id);
    setConfirmDelete(false);
  };

  return <div className="flex flex-wrap items-center justify-end gap-2">
    {isActive ? <button type="button" onClick={() => deactivate.mutate(id)} disabled={deactivate.isPending} className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container-low disabled:opacity-50">{deactivate.isPending ? "Working..." : "Deactivate"}</button> : <button type="button" onClick={() => activate.mutate(id)} disabled={activate.isPending} className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50">{activate.isPending ? "Working..." : "Activate"}</button>}
    <button type="button" onClick={() => setConfirmDelete(true)} disabled={useCount > 0} title={useCount > 0 ? "Used coupons cannot be deleted" : "Delete coupon"} className="rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-40">Delete</button>
    {confirmDelete && <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <button aria-label="Close confirmation" className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
      <div role="alertdialog" aria-modal="true" className="relative mx-4 w-full max-w-sm rounded-2xl bg-[#f8f9ff] p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-on-surface">Delete coupon?</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{code}</strong>? This action cannot be undone.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl px-4 py-3 font-semibold text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
          <button type="button" onClick={runDelete} disabled={remove.isPending} className="flex-1 rounded-xl bg-error px-4 py-3 font-semibold text-white disabled:opacity-50">{remove.isPending ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>}
  </div>;
}
