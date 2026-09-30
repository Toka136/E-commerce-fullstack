import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "../types/profile"
import { updateProfileApi } from "../api/updateProfile"
import { useRouter } from "next/navigation"

export const useUpdateProfile=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:updateProfile)=>updateProfileApi(data),
        onSuccess:()=>{
            router.refresh()
        }
    })
}