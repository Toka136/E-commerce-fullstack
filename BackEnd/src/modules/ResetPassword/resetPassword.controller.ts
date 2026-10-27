import { Request,Response,NextFunction } from "express"
import { resetPasswordS, sendResetPasswordLinkS } from "./resetPassword.service"
export const  sendResetPasswordLinkC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const email=req.body.email
        await sendResetPasswordLinkS(email)
         res.status(200).json({
            status:"success",
            message:"Reset Password Link Sent Successfully"
        })
        
    }catch(err){
        next(err)
    }
    
}
export const resetPasswordC=async( req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.body.token
        const password=req.body.password
        await resetPasswordS(token,password)
        res.status(200).json({
            status:"success",
            message:"Password Reset Successfully"
        })
    }catch(err){
        next(err)
    }
}