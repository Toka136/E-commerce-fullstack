import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFromWishlist } from "../api/removeFromWishlist"
import { useWishlistStore } from "../store/wishlist-store";

export const useDeleteFromWishlist=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(productId:string)=>deleteFromWishlist(productId),
        onSuccess:async()=>{
           await queryClient.invalidateQueries({ queryKey: ["wishlist"] })
            console.log("removed from wishlist")
             useWishlistStore.getState().setCount(useWishlistStore.getState().count-1)
        },
        onError:()=>{}
    })
}