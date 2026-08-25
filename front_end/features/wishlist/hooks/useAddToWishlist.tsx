import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addToWishlist } from "../api/addToWishlist"
import { useWishlistStore } from "../store/wishlist-store"

export const useAddToWishlist=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(productId:string)=>addToWishlist(productId),
        onSuccess:async () =>{
            console.log("added to wishlist")
            await  queryClient.invalidateQueries({
                queryKey: ["wishlist"],
              });

        },
        onError:()=>{}
    })
}