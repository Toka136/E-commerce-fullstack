import { NextFunction, Request, Response } from "express"
import { addBook_S } from "./book.service"

export const addBook_C=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const result=await addBook_S(req.body,req.file)

        res.status(200).json({
            status:"success",
            message:"Book Added Successfully",
            data:result
        })
    }catch(err){

        next(err)
    }
}