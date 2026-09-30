import { api } from "@/axios/api"
import { addReviewAProps, addReviewResponse, editReviewAProps } from "../types/review"

export const editReviewA=async({reviewId,rating,review}:editReviewAProps):Promise<addReviewResponse>=>{
    const res=await api.patch("/review/editReview",
        {
            reviewId,
            rating,
            review
        }
    )
    return res.data
}