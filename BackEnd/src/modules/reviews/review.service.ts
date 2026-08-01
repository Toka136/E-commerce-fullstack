import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { GetUserInfo } from "../../utils/userInfo"
import { addRate, deleteRate, editRate } from "../Books/book.repo"
import { addReview, deleteReview, editReview, getBookReviews, getReview, getReviewById } from "./review.repo"
import { editReviewI, reviewI } from "./review.types"

export const addReviewS=async(accessToken:string,review:reviewI)=>{
    const userId=await GetUserInfo(accessToken)
    const existingReview=await getReview(userId.id.toString(),review.bookId)
    if(existingReview){
        throw new appError("Review already exists",400,responseStatus.FAILED)
    }
    review.userId=userId.id.toString()
    await addRate(review.bookId,review.rating)
    return await addReview(review)
}

export const editReviewS=async(review:editReviewI)=>{
    console.log("review",review);
    const existingReview=await getReviewById(review.reviewId)
    if(!existingReview){
        throw new appError("Review Not Found",400,responseStatus.FAILED)
    }
    const reviewData={
        reviewId:existingReview._id.toString(),
        rating:(typeof review.rating === 'number') ? review.rating : existingReview.rating,
        // ensure review is a string (fall back to existing review or empty string)
        review: (typeof review.review === 'string') ? review.review : (existingReview.review ?? '')
    }
    console.log("review.rating",review.rating)
    if(review.rating!==undefined&&review.rating>=0){
        console.log("rating",review.rating)
        await editRate(existingReview.bookId.toString(),review.rating,existingReview.rating)
    }
     
    return await editReview(reviewData)
}
export const deleteReviewS=async(reviewId:string)=>{
    const existingReview=await getReviewById(reviewId)
      
    if(!existingReview){
        throw new appError("Review Not Found",400,responseStatus.FAILED)
    }
    await deleteRate(existingReview.bookId.toString(),existingReview.rating)
    return await deleteReview(reviewId.toString())
}