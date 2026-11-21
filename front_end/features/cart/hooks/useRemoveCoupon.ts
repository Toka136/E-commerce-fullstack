import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeCoupon } from "../api/removeCoupon"

export const useRemoveCoupon=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(couponCode:string)=>removeCoupon(couponCode),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["cart"]})
        }
    })
}