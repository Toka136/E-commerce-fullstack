import { api } from "@/axios/api"

export const deleteReviewA=async(reviewId:string)=>{
    const res=await api.delete("/review/deleteReview",
        {
            data:{
                reviewId
            }
        }
    )
    return res.data
}