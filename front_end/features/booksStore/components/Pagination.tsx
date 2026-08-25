"use client";

import Pagination from "@mui/material/Pagination";
import { PaginationItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function CustomPagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const router = useRouter();
   const searchParams=useSearchParams();
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("currentPage", page.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <nav
      className="flex items-center justify-center py-6"
      aria-label="Pagination"
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ChevronLeft, next: ChevronRight }}
            {...item}
            sx={{
              minWidth: 36,
              height: 36,
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#475569",
              backgroundColor:
                item.type === "page" || item.type === "previous" || item.type === "next"
                  ? "#EEF2FF"
                  : "transparent",
              "&:hover": {
                backgroundColor: "#E0E7FF",
              },
              "&.Mui-selected": {
                backgroundColor: "#4F46E5",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#4F46E5",
                },
              },
              "&.Mui-disabled": {
                opacity: 0.4,
              },
            }}
          />
        )}
      />
    </nav>
  );
}