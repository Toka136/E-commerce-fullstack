"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { OrderItem } from "../types/orders";
import { getItemImageUrl } from "../utils/format";


function Thumbnail({ item }: { item: OrderItem }) {
  const [imgError, setImgError] = useState(false);
  const src = getItemImageUrl(item.imageAtPurchase);

  if (!src || imgError) {
    return (
      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
        <BookOpen className="h-5 w-5" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={item.titleAtPurchase}
      onError={() => setImgError(true)}
      className="h-16 w-12 shrink-0 rounded-md border border-outline-variant/30 object-cover"
    />
  );
}

export default function OrderItemThumbnails({ items }: { items: OrderItem[] }) {
  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <Thumbnail key={item._id} item={item} />
      ))}
    </div>
  );
}
