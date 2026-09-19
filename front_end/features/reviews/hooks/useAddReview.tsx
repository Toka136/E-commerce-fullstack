import { useMutation } from "@tanstack/react-query"
import { addReviewAProps } from "../types/review"
import { addReviewA } from "../api/addReview"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export const useAddReview=()=>{
       const router=useRouter()
    return useMutation({
        mutationFn:(data:addReviewAProps)=>addReviewA(data),
        onError:(err)=>{
            if (err instanceof AxiosError) {
                console.log("STATUS:", err.response?.status);
                console.log("DATA:", err.response?.data);
                console.log("MESSAGE:", err.response?.data?.message);
                toast.error(err.response?.data?.message)
                
            }
        },
        onSuccess:()=>{
            router.refresh()
        }
    })
}