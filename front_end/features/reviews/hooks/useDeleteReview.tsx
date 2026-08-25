import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { deleteReviewA } from "../api/deleteReview"

export const useDeleteReview=()=>{
    return useMutation({
        mutationFn:(reviewId:string)=>deleteReviewA(reviewId),
        onError:(err)=>{
            if (err instanceof AxiosError) {
                console.log("STATUS:", err.response?.status);
                console.log("DATA:", err.response?.data);
                console.log("MESSAGE:", err.response?.data?.message);
                toast.error(err.response?.data?.message)
                
            }
        }
    })
}