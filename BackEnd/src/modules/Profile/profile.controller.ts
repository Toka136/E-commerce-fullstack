import { NextFunction, Request, Response } from "express"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { getUserProfileS, updateUserProfileS } from "./profile.service"
import { updateProfileI } from "./profile.types"

export const getUserProfileC=async(req:Request,res:Response,next:NextFunction)=>{
 
   const userId=req.user?.id
   if(!userId){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const user=await getUserProfileS(userId)
   console.log("user",user)
   res.status(200).json({
    status:"success",
    message:"User Found Successfully",
    data:user
   })
}
export const updateProfileC=async(req:Request,res:Response,next:NextFunction)=>{
    const userInfo=req.user
   if(!userInfo){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const newData=req.body as updateProfileI
   const result=await updateUserProfileS(userInfo.id.toString(),newData,req.file)
   res.status(200).json({
    status:"success",
    message:"User Updated Successfully",
    data:result
   })
}