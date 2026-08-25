import { useMutation } from "@tanstack/react-query"
import {  editReviewAProps } from "../types/review"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { editReviewA } from "../api/editReview"

export const useEditReview=()=>{
    return useMutation({
        mutationFn:(data:editReviewAProps)=>editReviewA(data),
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