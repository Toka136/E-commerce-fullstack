import { Request, Response, NextFunction } from "express";
import appError from "../utils/errorClass";
import { responseStatus } from "../utils/responseStatus";
import { getAddress } from "../modules/Address/Address.repo";

export const addressPermision=async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.id
    if(!userId){
        return next(new appError("You are not logged in",401,responseStatus.FAILED))
    }
    const addressId=req.body.addressId
    if(!addressId){
        return next(new appError("Address Id is required",400,responseStatus.FAILED))
    }
    const address=await getAddress(addressId)
    if(!address){
        return next(new appError("Address Not Found",404,responseStatus.FAILED))
    }
    if(address.userId.toString()!==userId.toString()){
        return next(new appError("You are not authorized",403,responseStatus.FAILED))
    }
    next()
}
