"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  X,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { WishlistItem } from "../types/wishlist";
import { formatPrice, getCoverImageUrl } from "@/features/userDashboard/utils/format";
import { stockStatus } from "../utils/wiahlistFormates";
import { WishlistItemCard } from "./wishlistItem";

type SortOption = "recent" | "price-low" | "price-high";

interface WishlistPageProps {
  items: WishlistItem[];

}

export default function WishlistPage({ items}: WishlistPageProps) {
  // const [localItems, setLocalItems] = useState(items);
  const [sort, setSort] = useState<SortOption>("recent");
  const [filterOpen, setFilterOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const sortedItems = useMemo(() => {
    const copy = [...items];
    if (sort === "price-low") copy.sort((a, b) => a.productId.price - b.productId.price);
    if (sort === "price-high") copy.sort((a, b) => b.productId.price - a.productId.price);
    return copy;
  }, [items, sort]);

  // const handleRemove = async (itemId: string) => {
  //   setLocalItems((prev) => prev.filter((item) => item._id !== itemId));
  //   await onRemove?.(itemId);
  // };


  return (
    <div className="min-h-screen bg-[#F7F7FB] px-4 pb-10 pt-6">
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-1 text-[14px] text-gray-500">
            {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen((open) => !open)}
            className="flex items-center gap-1.5 pt-1 text-[14px] font-semibold text-indigo-600"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          {filterOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
              {(
                [
                  { value: "recent", label: "Recently added" },
                  { value: "price-low", label: "Price: low to high" },
                  { value: "price-high", label: "Price: high to low" },
                ] as { value: SortOption; label: string }[]
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSort(option.value);
                    setFilterOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-[13px] ${
                    sort === option.value
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {sortedItems.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-[16px] font-semibold text-gray-800">Your wishlist is empty</p>
          <p className="mt-1 text-[14px] text-gray-500">
            Save books you love and they&apos;ll show up here.
          </p>
        </div>
      )}

      {/* Item cards */}
      <div className="mt-5 space-y-4">
        {sortedItems.map((item) => {
          const product = item.productId;
          const stock = stockStatus(product);
          const isAdded = addedIds.has(product._id);

          return (
           <WishlistItemCard
              key={item._id}
              item={item}
              stock={stock}
              isAdded={isAdded}
              // handleRemove={handleRemove}
            />
          );
        })}
      </div>
    </div>
  );
}

