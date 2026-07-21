import { NextFunction, Request, Response } from "express"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { changeOrderStatusS, createOrderS, getOrdersS } from "./order.service"

export const createOrderC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
   const token=req.cookies.accessToken
   if(!token){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const order=await createOrderS(token,req.body.phone,req.body.address)
   res.status(200).json({
    status:"success",
    message:"Order Created Successfully",
    data:order
   })}catch(err){
    next(err)
   }
}
export const getOrdersC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const accessToken=req.cookies.accessToken
        if(!accessToken){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const orders=await getOrdersS(accessToken)
        res.status(200).json({
            status:"success",
            message:"Orders Found Successfully",
            data:orders
        })
    }catch(err){
        next(err)
    }
}
export const changeOrderStatusC=async(req:Request,res:Response,next:NextFunction)=>{
    console.log("req.params",req.params)
    try{
        console.log("req.params",req.params)
        const orderId=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        const status=req.body.status
        if(!orderId||!status){
            throw new appError("id and status is required",400,responseStatus.FAILED)
        }
        const result=await changeOrderStatusS(orderId,status)
        res.status(200).json({
            status:"success",
            message:"Order Status Changed Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}