import { Request,Response,NextFunction } from "express"
import { addProductInCart_S, getCartS, removeProductFromCartS, updateCart_S } from "./Cart.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
export const addProductInCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        console.log('req.body)', req.body)
        const result=await addProductInCart_S({bookId:req.body.bookId,userId,quantity:req.body.quantity??1})
        res.status(200).json({
            status:"success",
            message:"Product Added Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const updateProductInCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const result=await updateCart_S({bookId:req.body.bookId,userId,quantity:req.body.quantity??1})
        res.status(200).json({
            status:"success",
            message:"Product Updated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const result=await getCartS(userId)
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
    const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
    const result= await removeProductFromCartS({bookId:req.body.bookId, userId})
    res.status(200).json({
            status:"success",
            message:"Product Deletd Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
