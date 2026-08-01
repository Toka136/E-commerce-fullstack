import { NextFunction,  Request, Response } from "express";
import { CusomtJwtPayload } from "../modules/Auth/Auth.types";
import appError from "../utils/errorClass";
import { responseStatus } from "../utils/responseStatus";
import jwt from "jsonwebtoken"
export const userPermission = (req:Request, res:Response, next:NextFunction) => {
    try{
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        throw new appError("Please login to get access.",401,responseStatus.FAILED)
    }
    console.log("accessToken userpermission",accessToken)
    const userInfo=jwt.verify(accessToken,process.env.JWT_SECRET_KEY as string) as CusomtJwtPayload;

    if(userInfo){
        if(userInfo.role!=="user"){
             next( new appError("Please Login First",403,responseStatus.FAILED))
        }
        next()
       
    }}catch(err){
        console.log(err)
        const error =err as Error
        next(new appError(error.message,401,responseStatus.FAILED))
    }
  };