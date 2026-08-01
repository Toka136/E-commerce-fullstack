import reviewModal from "./review.modal"
import { editReviewI, reviewI } from "./review.types"

export const getReview=async(userId:string,bookId:string)=>{
    return await reviewModal.findOne({userId,bookId})
}
export const getReviewById=async(id:string)=>{
    return await reviewModal.findOne({_id:id})
}
export const addReview=async(review:reviewI)=>{
    return await reviewModal.create(review)
}
export const getBookReviews=async(bookId:string)=>{
    return await reviewModal.find({bookId}).select({__v:0,bookId:0,createdAt:0}).populate({path:"userId",select:{userName:1}})
}
export const editReview=async (reviewData:editReviewI)=>{
    return await reviewModal.updateOne({_id:reviewData.reviewId},{$set:{
        rating:reviewData.rating&&reviewData.rating,
        review:reviewData.review&&reviewData.review
    }})
}
export const deleteReview=async(id:string)=>{
    console.log("id final",id)
    return await reviewModal.deleteOne({_id:id})
}