import { useQuery } from "@tanstack/react-query"
import { getUserData } from "../api/getUserData"

export const useGetProfile=()=>{
    return useQuery({
        queryKey:["profile"],
        queryFn:getUserData,
        retry:false,
        staleTime:5*60*1000
    })
}