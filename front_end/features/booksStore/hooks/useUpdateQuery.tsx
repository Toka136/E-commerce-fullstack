"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Returns a function that merges `updates` into the current URL's query
 * string and pushes the new URL. Pass `value: null` to remove a param.
 *
 * By default any call resets `page` back to the first page, since changing
 * a filter should restart pagination. Pass `{ resetPage: false }` when the
 * update itself IS the page change (see Pagination.tsx).
 */
export function useUpdateQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (
      updates: Record<string, string | null>,
      options?: { resetPage?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (options?.resetPage !== false) {
        params.delete("page");
      }

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );
}