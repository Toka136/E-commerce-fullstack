import { NextFunction, Request, Response } from "express"
import { addBookWishListS, deleteBookWS, getWishListS, moveToCartS } from "./WishList.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"

export const getWishListC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const userId=req.user?.id
    if(!userId){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const wishList=await getWishListS(userId)
    res.status(200).json(wishList)}catch(err){
        next(err)
    }
}
export const addBookWishListC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        console.log("req.user",req.user)
    const userId=req.user?.id
    if(!userId){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await addBookWishListS(userId,req.body.bookId)
    res.status(200).json({
        status:"success",
        message:"Book Added Successfully",
        data:result
    })}catch(err){
        next(err)
    }
}
export const deleteBookWC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const userId=req.user?.id
    if(!userId){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await deleteBookWS(userId,req.body.bookId)
    res.status(200).json({
        status:"success",
        message:"Book Deleted Successfully",
        data:result
    })}catch(err){
        next(err)
    }

}
export const moveToCartC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const useId=req.user?.id
    if(!useId){
        throw new appError("You are not logged in",401,responseStatus.FAILED)
    }
    const result=await moveToCartS(useId,req.body.productId)
    res.status(200).json({
        status:"success",
        message:"Product Deleted Successfully",
        data:result
    })}catch(err){
        next(err)
    }
}