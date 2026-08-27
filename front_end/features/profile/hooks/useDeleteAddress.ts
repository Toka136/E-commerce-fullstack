import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "../types/profile"
import { updateProfileApi } from "../api/updateProfile"
import { useRouter } from "next/navigation"
import { deleteAddress } from "../api/deletsAddress"

export const useDeleteAddress=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(addressId:string)=>deleteAddress(addressId),
        onSuccess:()=>{
            router.refresh()
        }
    })
}