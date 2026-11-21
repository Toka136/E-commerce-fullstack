"use client";

import { CartItem } from "@/features/cart/types/cart";
import { Receipt } from "lucide-react";
import BookRow from "./bookRow";
import { cartProps } from "@/features/cart/components/cartSummary";
import { formatPrice } from "@/features/userDashboard/utils/format";



interface OrderSummaryProps extends cartProps {
  items: CartItem[];
}

export default function OrderSummary({discountAmount,subtotal,totalPrice,couponCode,items}:OrderSummaryProps) {
  const shipping =  50;
  const tax = 0;
  const grandTotal = totalPrice + shipping + tax;
   console.log("grasubtotalnd total",subtotal)
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Receipt className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Order Summary
        </h2>
      </div>

      <div className="rounded-2xl bg-surface-container-low p-4">
        <div className="divide-y divide-outline-variant/40">
          {items.map((item) => (
            <BookRow key={item.book.id} item={item} />
          ))}
        </div>

        <div className="mt-3 space-y-1.5 border-t border-outline-variant/40 pt-3 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>${Number(subtotal).toFixed(2)}</span>
          </div>
           {(discountAmount||0)>0&&<div className="flex items-center justify-between">
                          <span>{couponCode}</span>
                          <span className="font-medium text-gray-900">-{formatPrice(discountAmount||0)}</span>
                        </div>}
          <div className="flex justify-between text-on-surface-variant">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-outline-variant/40 pt-3">
          <span className="text-base font-semibold text-on-surface">
            Grand Total
          </span>
          <span className="text-lg font-bold text-primary">
            ${Number(grandTotal).toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}