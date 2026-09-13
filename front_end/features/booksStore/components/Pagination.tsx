import Pagination from "@mui/material/Pagination";
import { PaginationItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // نمرر الـ searchParams الحالية كمُدخل بسيط من الصفحة الأم
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CustomPagination({
  currentPage,
  totalPages,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // دالة مساعدة لبناء رابط الصفحة بناءً على الـ Params الحالية
  const createPageURL = (pageNumber: number | null) => {
    if (!pageNumber) return "#";
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("currentPage", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      shape="rounded"
      renderItem={(item) => (
        <PaginationItem
          // ✅ ربط المكون بـ Link الخاص بـ Next.js
          component={Link}
          href={createPageURL(item.page)}
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
  );
}