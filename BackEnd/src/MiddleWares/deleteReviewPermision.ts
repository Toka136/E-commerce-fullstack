import { NextFunction ,Request,Response} from "express"
import jwt from "jsonwebtoken"
import appError from "../utils/errorClass"
import { responseStatus } from "../utils/responseStatus"
import { CusomtJwtPayload } from "../modules/Auth/Auth.types"
import { getReviewById } from "../modules/reviews/review.repo"
import { ObjectId } from "mongodb"
export const deleteReviewPermision=async(req:Request,res:Response,next:NextFunction)=>{
    try{
   const accessToken=req.cookies.accessToken;
   const userInfo=jwt.verify(accessToken,process.env.JWT_SECRET_KEY as string) as CusomtJwtPayload;
   const reviewId=req.body.reviewId
   console.log("ree",reviewId)
   if(!reviewId){
     throw new appError("Review Id is required",400,responseStatus.FAILED)
   }
   if(userInfo){
       
       const review=await getReviewById(reviewId)
       if(!review){
           throw new appError("Review Not Found",404,responseStatus.FAILED)
       }
       if(userInfo.role==="admin"){
        console.log("admin")
           return next()
       }
       console.log("role",typeof (userInfo.role))
       console.log("userInfo.role===admin",userInfo.role==="admin")
       console.log("review.userId",review.userId)
       console.log("userInfo.id",userInfo.id)
       if(review.userId.toString()!==userInfo.id.toString()){
           return next( new appError("You are not authorized",403,responseStatus.FAILED))
       }
       return next()
      
   }}catch(err){
       console.log(err)
       const error =err as Error
       return next(new appError(error.message,401,responseStatus.FAILED))
   }
}