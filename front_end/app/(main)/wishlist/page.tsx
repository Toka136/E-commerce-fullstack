"use client"
import WishlistPage from "@/features/wishlist/components/wishlist";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";
import { GetWishlistResponse } from "@/features/wishlist/types/wishlist";
import { AxiosError } from "axios";
import { useEffect } from "react";


export default  function WishlistRoute() {
  const {data:response,isLoading,error,isFetching} = useGetWishlist()
   console.log("response",response?.items)
    console.log("Wishlist Route rendered");
  console.log("response:", response?.items);
  console.log("isLoading:", isLoading);
  console.log("isFetching:", isFetching);

  useEffect(() => {
    if (error instanceof AxiosError) {
      // const 
      console.log(error);
    }
  },[error])
  return<>
  {isLoading && <h1>Loading...</h1>}
   {response && <WishlistPage items={response.items || []} />}
  </>
}