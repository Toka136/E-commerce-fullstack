import { useQuery } from "@tanstack/react-query";
import { getBooksA } from "../api/getBooks";
import { gteBooksParams } from "../types/books";

export const useGetBooks = (params: gteBooksParams) => {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooksA(params),
  });
};