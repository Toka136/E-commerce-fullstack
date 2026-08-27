import { NextFunction, Request, Response } from "express"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { getUserProfileS, updateUserProfileS } from "./profile.service"
import { updateProfileI } from "./profile.types"

export const getUserProfileC=async(req:Request,res:Response,next:NextFunction)=>{
   console.log("req.user",req.user)
   console.log("req.cookies contains",req.cookies)
   const userInfo=req.user
   console.log("userInfo",userInfo)
   if(!userInfo){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const user=await getUserProfileS(userInfo.id.toString())
   res.status(200).json({
    status:"success",
    message:"User Found Successfully",
    data:user
   })
}
export const updateProfileC=async(req:Request,res:Response,next:NextFunction)=>{
    const userInfo=req.user
   console.log("userInfoCCCCCc",userInfo)
   if(!userInfo){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const newData=req.body as updateProfileI
   console.log("newData",newData)
   const result=await updateUserProfileS(userInfo.id.toString(),newData,req.file)
   res.status(200).json({
    status:"success",
    message:"User Updated Successfully",
    data:result
   })
}