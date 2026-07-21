import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken"
import appError from "../utils/errorClass";
import { responseStatus } from "../utils/responseStatus";
import { CusomtJwtPayload } from "../modules/Auth/Auth.types";
export const adminPermision= async(req:Request,res:Response,Next:NextFunction)=>{
    try{
          const accessToken= req.cookies.accessToken;
    console.log("accessToken permission",accessToken)
    const userInfo=jwt.verify(accessToken,process.env.JWT_SECRET_KEY as string) as CusomtJwtPayload;

    console.log("userInfo",userInfo)
    if(userInfo){
        if(userInfo.role!=="admin"){
             Next( new appError("You are not admin",403,responseStatus.FAILED))
        }
       
    }else{
        Next( new appError("You are not admin",403,responseStatus.FAILED))
    }

    }catch(err){
        console.log(err)
        Next(new appError("jwt expired",401,responseStatus.FAILED))
    }
  
}