import { getPaymentmethods } from "../../services/fawaterak/fawaterak.service"
import { Request,Response,NextFunction } from "express"
import {  getPaymentDetailsS } from "./payment.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
export const getPaymentMethodsC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await getPaymentmethods()
        res.status(200).json({
            status:"success",
            message:"Payment Methods Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
    
}
export const getPaymentDetailsC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const id=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!id){
            throw new appError("id is required",400,responseStatus.FAILED)
        }
        const result=await getPaymentDetailsS(userId,id)
        res.status(200).json({
            status:"success",
            message:"Payment Details Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
    
}