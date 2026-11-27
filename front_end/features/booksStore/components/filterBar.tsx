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