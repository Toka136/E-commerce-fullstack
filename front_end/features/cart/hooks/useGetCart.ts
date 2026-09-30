import { useQuery } from "@tanstack/react-query"
import { getCartApi } from "../api/getCartApi"

export const useGetCart=()=>{
    return useQuery({
        queryKey:["cart"],
        queryFn:()=>getCartApi()
    })
}