import { useMutation } from "@tanstack/react-query"
import { setAsDefault } from "../api/setAsDefault"
import { useRouter } from "next/navigation"

export const useSetAsDefault=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(addressId:string)=>setAsDefault(addressId),
        onSuccess:()=>{
            router.refresh()
        }
    })
}