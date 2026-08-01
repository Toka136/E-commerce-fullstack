import { Request, Response, NextFunction } from "express";
import { addReviewS, deleteReviewS, editReviewS } from "./review.service";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
export const addReviewC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const accessToken=req.cookies.accessToken
        if(!accessToken){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const result=await addReviewS(accessToken,req.body)
        res.status(200).json({
            status:"success",
            message:"Review Added Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const editReviewC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       
        const result=await editReviewS(req.body)
        res.status(200).json({
            status:"success",
            message:"Review Updated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const deleteReviewC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       console.log("controll",req.body)
        const result=await deleteReviewS(req.body.reviewId)
        res.status(200).json({
            status:"success",
            message:"Review Deleted Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}