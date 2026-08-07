import { Request,Response,NextFunction } from "express"
import { addProductInCart_S, getCartS, removeProductFromCartS } from "./Cart.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
export const addProductInCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const accessToken=req.cookies.accessToken
        console.log("accessToken cart",accessToken)
        if(!accessToken){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const result=await addProductInCart_S({productId:req.body.productId,token:accessToken,quantity:req.body.quantity??1})
        res.status(200).json({
            status:"success",
            message:"Product Added Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const accessToken=req.cookies.accessToken
        console.log("accessToken cart",accessToken)
        if(!accessToken){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const result=await getCartS({token:accessToken})
        res.status(200).json({
            status:"success",
            message:"Cart Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const removeProductFromCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const accessToken=req.cookies.accessToken
    if(!accessToken)
    {
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result= await removeProductFromCartS({productId:req.body.productId,token:accessToken})
    res.status(200).json({
            status:"success",
            message:"Product Deletd Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
