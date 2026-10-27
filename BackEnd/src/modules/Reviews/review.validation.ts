import * as z from "zod"
export const reviewSchema=z.object({
    bookId:z.string(),
    rating:z.number().max(5).min(0),
    review:z.string().optional()
})
export const editReviewSchema=z.object({
    reviewId:z.string(),
    rating:z.number().optional(),
    review:z.string().optional()
})