import { activateCouponS, addCouponS, deactivateCouponS, deleteCouponS, editCouponS, getCouponS, getCouponsS } from "./Coupon.service"
import { Request,Response,NextFunction } from "express"
export const addCouponC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await addCouponS(  req.body)
        res.status(200).json({
            status:"success",
            message:"Coupon Added Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const editCouponC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const couponId=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!couponId){
            throw new Error("Coupon Id is required")
        }
        
        const result=await editCouponS(couponId, req.body)
        res.status(200).json({
            status:"success",
            message:"Coupon Updated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getCouponC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const couponCode=Array.isArray(req.params.code)?req.params.code[0]:req.params.code
        if(!couponCode){
            throw new Error("Coupon Code is required")
        }
        const result=await getCouponS(couponCode)
        res.status(200).json({
            status:"success",
            message:"Coupon Founded Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getCouponsC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       
        const result=await getCouponsS()
        res.status(200).json({
            status:"success",
            message:"Coupon Founded Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const deleteCouponC=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const couponId=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!couponId){
            throw new Error("Coupon Id is required")
        }
        const result=await deleteCouponS(couponId)
        res.status(200).json({
            status:"success",
            message:"Coupon Deleted Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const deactivateCouponC=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const couponId=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!couponId){
            throw new Error("Coupon Id is required")
        }
        const result=await deactivateCouponS(couponId)
        res.status(200).json({
            status:"success",
            message:"Coupon Deactivated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const activateCouponC=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const couponId=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!couponId){
            throw new Error("Coupon Id is required")
        }
        const result=await activateCouponS(couponId)
        res.status(200).json({
            status:"success",
            message:"Coupon Activated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}