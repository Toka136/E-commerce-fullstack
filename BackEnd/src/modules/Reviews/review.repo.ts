import { editReviewI, reviewI } from "./review.types"
import {prisma} from "../../config/prisma"
export const getReview = async (userId: string, bookId: string) => {
  return prisma.bookReview.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });
};
export const getReviewById=async(id:string)=>{
    return await prisma.bookReview.findUnique({where:{id}})
}
export const addReview=async(review:reviewI)=>{
    return await prisma.bookReview.create({data:review})
}
export const getBookReviews=async(bookId:string)=>{
    return await prisma.bookReview.findMany({
        where:{bookId},
       
        include:{user:{select:{userName:true}}},
        orderBy: {
      createdAt: "desc",
    },
    })
  
}
export const editReview=async (reviewData:editReviewI)=>{
    const { reviewId, ...data } = reviewData;
    return await prisma.bookReview.update({where:{id:reviewId},data:data})
    
}
export const deleteReview=async(id:string)=>{
    return await prisma.bookReview.delete({where:{id}})
}