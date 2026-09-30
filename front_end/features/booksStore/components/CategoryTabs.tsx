"use client";

import { useSearchParams } from "next/navigation";
import { useUpdateQuery } from "../hooks/useUpdateQuery";
import { Category } from "@/features/categories/types/categories";
import { useState } from "react";


export default function CategoryTabs({categories}:{categories:Category[]}) {
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const active = searchParams.get("category") ?? "All";

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar"
      role="tablist"
      aria-label="Book categories"
    >
      {categories.map((category) => {
        const isActive = category.slug === active;
        return (
          <button
            key={category._id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() =>
              updateQuery({ category: category.name === "All" ? null : category.slug })
            }
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#4F46E5] text-white"
                : "bg-[#EEF2FF] text-[#475569] hover:bg-[#E0E7FF]"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}