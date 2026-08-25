export interface addReviewAProps{
    bookId:string
    rating:number
    review?:string
}
export interface editReviewAProps{
    reviewId:string
    rating:number
    review?:string
}
export interface reviewI{
    userId: string,
    bookId: string,
    rating: number,
    review: string,
    _id: string,
    createdAt: string,
    updatedAt: string,
}
export interface addReviewResponse{
    status:string,
    message:string,
    data:reviewI
}