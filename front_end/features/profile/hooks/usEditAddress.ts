import { useMutation } from "@tanstack/react-query"

import { useRouter } from "next/navigation"
import { addAddressApi } from "../api/addAdderess"
import { editAddressParams } from "../types/address"
import { editAddress } from "../api/editAddress"

export const useEditAddress=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:editAddressParams)=>editAddress(data),
        onSuccess:()=>{
            router.refresh()
        }
    })
}