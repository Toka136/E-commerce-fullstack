import { useQuery } from "@tanstack/react-query"
import { getOPaymentMethods } from "../api/getPaymentMethods"

export const useGetOPaymentMethods=()=>{
    return useQuery({
        queryKey:["onlinePaymentMethods"],
        queryFn:getOPaymentMethods
    })
}