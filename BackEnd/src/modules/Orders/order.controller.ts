import { NextFunction, Request, Response } from "express"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { changeOrderStatusS, createOrderS, getOrderS, getOrdersS } from "./order.service"

export const createOrderC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
   const id=req.user?.id.toString()
   if(!id){
    throw new appError("You are not logged in",401,responseStatus.FAILED)
   }
   const order=await createOrderS(id,req.body.address,req.body.paymentMethod)
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
        console.log("requser admin",req.user)
        console.log("req.cookies admin",req.cookies)
        const id=req.user?.id.toString()
        if(!id){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        if(!req.user){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const orders=await getOrdersS(id,req.user?.role)
        res.status(200).json({
            status:"success",
            message:"Orders Found Successfully",
            data:orders
        })
    }catch(err){
        next(err)
    }
}
export const getOrderC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       
        if(!req.user){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const id=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!id){
            throw new appError("id is required",400,responseStatus.FAILED)
        }
         const userId=req.user?.id.toString()
        const orders=await getOrderS(id,userId,req.user?.role)
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