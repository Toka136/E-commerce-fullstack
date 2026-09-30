import { useMutation, useQueryClient } from "@tanstack/react-query"
import { moveToCart } from "../api/moveToCart"
import { useWishlistStore } from "../store/wishlist-store";

export const useMoveToCart=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(productId:string)=>moveToCart(productId),
         onSuccess: async () => {
            useWishlistStore.getState().setCount(useWishlistStore.getState().count-1)
      await queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      console.log("added to cart");
    },
        onError:()=>{}
    })
}