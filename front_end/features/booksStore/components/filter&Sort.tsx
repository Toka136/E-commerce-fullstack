"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SortOption } from "@/features/userDashboard/types/books";


const OPTIONS: SortOption[] = [
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center justify-between gap-2 w-full rounded-xl bg-[#EEF2FF] px-4 py-2.5 text-sm font-semibold text-[#1E293B]"
      >
        <span>{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#4F46E5] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
        >
          {OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  option === value
                    ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                    : "text-[#334155] hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}