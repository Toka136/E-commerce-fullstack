import { useQuery } from "@tanstack/react-query";
import { getWishlistA } from "../api/getWishlist";

export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistA,
    staleTime: 0,
    refetchOnMount: "always",
  });
};