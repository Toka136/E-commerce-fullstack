import { NextFunction, Request, Response } from "express"
import { getCardsS } from "./admin.service"

export const getCards=async(req:Request,res:Response,next:NextFunction)=>{
   try{
    const data=await getCardsS()
    res.status(200).json({
       status:"success",
       message:"Cards Found Successfully",
       data
   })
   }catch(err){
    next(err)
   }

}