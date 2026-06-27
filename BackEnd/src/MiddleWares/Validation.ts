import { NextFunction, Request, Response } from "express";
import appError from "../utils/errorClass";
import { responseStatus } from "../utils/responseStatus";
export const validationSchema=(schema:any)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        console.log("req.body",req.body)
        const result=schema.safeParse(req.body)
        if(result.success){
            req.body=result.data
            next()
        }else{
            next(new appError(`${result.error.issues[0].path[0]} ${result.error.issues[0].message}`,400,responseStatus.ERROR))
        }
    }
}