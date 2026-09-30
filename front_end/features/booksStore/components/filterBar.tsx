"use client";

import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUpdateQuery } from "../hooks/useUpdateQuery";
import { SortOption } from "@/features/userDashboard/types/books";
import SortDropdown from "./SortDropdown";

interface FilterSortBarProps {
  // Wire this up to whatever filter panel/drawer you build next
  // (price range, rating, stock, etc). Those filters should follow the
  // same pattern: read from searchParams, write via useUpdateQuery.
  onOpenFilters?: () => void;
}

export default function FilterSortBar({ onOpenFilters }: FilterSortBarProps) {
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const sort = (searchParams.get("sort") as SortOption) ?? "Newest";

  return (
    <div className="mb-8 flex items-center gap-3 w-[90%] mx-auto mt-8">
      <div className="w-fit">
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex items-center gap-2 rounded-xl bg-[#EEF2FF] px-4 py-2.5 text-sm font-semibold text-[#1E293B]"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#4F46E5]" />
        Filters
      </button>
    </div>
      <div className="w-fit">
        <SortDropdown
          value={sort}
          onChange={(value) =>
            updateQuery({ sort: value === "newest" ? null : value })
          }
        />
      </div>
    </div>
  );
}