export interface reviewParamsI{
    bookId:string,
    rating:number,
    review?:string
}
export interface reviewI extends reviewParamsI{
    userId:string
    
}

export interface editReviewI{
    reviewId:string,
    rating?:number,
    review?:string
}