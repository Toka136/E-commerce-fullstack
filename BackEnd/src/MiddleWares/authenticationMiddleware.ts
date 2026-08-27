import { NextFunction, Request, Response } from "express"
import appError from "../utils/errorClass"
import { responseStatus } from "../utils/responseStatus"
import { GetUserInfo } from "../utils/userInfo"
import { userInfo } from "../Types/middleWareType"

export const authenticationMiddleware=async (req:Request,res:Response,next:NextFunction)=>{
   const token=req.cookies.accessToken
   console.log("req.bodyMiddleware",req.body)
   console.log("token",req.cookies)
    if(!token){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const user=await GetUserInfo(token)
        req.user=user as userInfo
        next()
}