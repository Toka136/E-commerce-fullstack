import { useMutation, useQueryClient } from "@tanstack/react-query"
import { applyCoupon } from "../api/applyCoupon"

export const useApplyCoupon=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(couponCode:string)=>applyCoupon(couponCode),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["cart"]})
        }
    })
}