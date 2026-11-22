import { getPaymentmethods } from "../../services/fawaterak/fawaterak.service"
import { Request,Response,NextFunction } from "express"
export const getPaymentMethodsC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await getPaymentmethods()
        res.status(200).json({
            status:"success",
            message:"Payment Methods Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}