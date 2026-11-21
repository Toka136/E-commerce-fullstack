"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CartItem } from "@/features/cart/types/cart";
import Image from "next/image";

export default function BookRow({ item }: { item: CartItem }) {
  const [imgError, setImgError] = useState(false);
  const lineTotal = item.priceAtPurchase * item.quantity;

  return (
    <div className="flex items-center gap-3 py-3">
      {item.book.coverImage  ? (
        // eslint-disable-next-line @next/next/no-img-element
        <Image
          src={`${item.book.coverImage}`}
          alt={item.book.title}
          onError={() => setImgError(true)}
          width={48}
          height={64}
          className="h-14 w-11 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
          <BookOpen className="h-5 w-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-on-surface">
          {item.book.title}
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