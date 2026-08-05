import { NextFunction, Request, Response } from "express"
import { addProductWishListS, deleteProductWS, getWishListS, moveToCartS } from "./WishList.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"

export const getWishListC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const token=req.cookies.accessToken
    if(!token){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const wishList=await getWishListS(token)
    res.status(200).json(wishList)}catch(err){
        next(err)
    }
}
export const addProductWishListC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const token=req.cookies.accessToken
    if(!token){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await addProductWishListS(token,req.body.productId)
    res.status(200).json({
        status:"success",
        message:"Product Added Successfully",
        data:result
    })}catch(err){
        next(err)
    }
}
export const deleteProductWC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const token=req.cookies.accessToken
    if(!token){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await deleteProductWS(token,req.body.productId)
    res.status(200).json({
        status:"success",
        message:"Product Deleted Successfully",
        data:result
    })}catch(err){
        next(err)
    }

}
export const moveToCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const token=req.cookies.accessToken
    if(!token){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await moveToCartS(token,req.body.productId)
    res.status(200).json({
        status:"success",
        message:"Product Deleted Successfully",
        data:result
    })}catch(err){
        next(err)
    }
}