import { api } from "@/axios/api"
import { addReviewAProps, addReviewResponse } from "../types/review"

export const addReviewA=async({bookId,rating,review}:addReviewAProps):Promise<addReviewResponse>=>{
    const res=await api.post("/review/addReview",{
        bookId,
        rating,
        review
    })
    return res.data

}