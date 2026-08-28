"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CartItem } from "@/features/cart/types/cart";

export default function BookRow({ item }: { item: CartItem }) {
  const [imgError, setImgError] = useState(false);
  const lineTotal = item.priceAtPurchase * item.quantity;

  return (
    <div className="flex items-center gap-3 py-3">
      {item.product.coverImage  ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`http://localhost:4000/api/Uploads/${item.product.coverImage}`}
          alt={item.product.title}
          onError={() => setImgError(true)}
          className="h-14 w-11 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
          <BookOpen className="h-5 w-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-on-surface">
          {item.product.title}
        </p>
        {/* <p className="truncate text-xs text-on-surface-variant">
          {item.product.}
        </p> */}
        <p className="mt-0.5 text-xs text-on-surface-variant">
          Qty: {item.quantity}
        </p>
      </div>

      <span className="shrink-0 text-sm font-medium text-on-surface">
        ${lineTotal.toFixed(2)}
      </span>
    </div>
  );
}