import { X } from "lucide-react";
import { ReactNode } from "react";
import { Coupon } from "../types/coupons";
import { AddCouponForm } from "./AddCouponForm";
import { EditCouponForm } from "./EditCouponForm";

function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
    <div onClick={onClose} className={`absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
    <section className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f9ff] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <header className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low px-6 py-4">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-surface-container-high"><X className="h-5 w-5" /></button>
      </header>
      {children}
    </section>
  </div>;
}

export function AddCouponModal(props: { open: boolean; onClose: () => void }) {
  return <Drawer {...props} title="Add Coupon"><AddCouponForm handleClose={props.onClose} /></Drawer>;
}

export function EditCouponModal(props: { open: boolean; onClose: () => void; coupon: Coupon }) {
  return <Drawer {...props} title="Edit Coupon"><EditCouponForm coupon={props.coupon} handleClose={props.onClose} /></Drawer>;
}
