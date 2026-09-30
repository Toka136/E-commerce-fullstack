import { useMutation } from "@tanstack/react-query"
import { CreateAddressParams } from "../types/address"
import { useRouter } from "next/navigation"
import { addAddressApi } from "../api/addAdderess"

export const useAddAddress=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:CreateAddressParams)=>addAddressApi(data),
        onSuccess:()=>{
            router.refresh()
        }
    })
}