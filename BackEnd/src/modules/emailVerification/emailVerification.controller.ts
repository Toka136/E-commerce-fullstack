import { Request, Response, NextFunction } from "express";
import { verifyEmailS } from "./emailVerification.service";
export const veifyEmailC=async( req:Request,res:Response,next:NextFunction)=>{
    try{
        const rowToken=req.body.token
        await verifyEmailS(rowToken)
        res.status(200).json({
            status:"success",
            message:"User Verified Successfully"
        })
    }catch(err){
        next(err)
    }
}