"use client";

import { useSearchParams } from "next/navigation";
import { useUpdateQuery } from "../hooks/useUpdateQuery";
import { Category } from "@/features/categories/types/categories";

/** Filter pills: "All books" + one pill per category (driven by ?category=slug). */
export default function CategoryTabs({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const active = searchParams.get("category"); // null = all

  const tabs = [
    { id: "all", name: "All books", slug: null as string | null },
    ...categories
      .filter((c) => c.name !== "All")
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug as string | null })),
  ];

  return (
    <div
      className="no-scrollbar flex gap-2 overflow-x-auto mt-4"
      role="tablist"
      aria-label="Book categories"
    >
      {tabs.map((tab) => {
        const isActive = tab.slug === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => updateQuery({ category: tab.slug })}
            className={`shrink-0 whitespace-nowrap rounded-md border px-3 py-1 text-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B66D0] ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-[#CBD5E1] bg-white text-[#334155] hover:bg-surface hover:text-black"
            }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}