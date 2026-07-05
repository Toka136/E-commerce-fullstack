import { NextFunction, Request, Response } from "express"
import { addBook_S, deleteBook_S, editBook_S, getBook_S, getBooks_S } from "./book.service"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"

export const addBook_C=async(req:Request,res:Response,next:NextFunction)=>{
    console.log("req.file",req.file)
    try{
       const result=await addBook_S(req.body,req.file)
       console.log("result add book",result)
        res.status(200).json({
            status:"success",
            message:"Book Added Successfully",
            data:result
        })
    }catch(err){

        next(err)
    }
}
export const updateBook_C=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await editBook_S(req.body,req.file)
        res.status(200).json({
            status:"success",
            message:"Book Updated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const deleteBook_C=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const id=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
       if(!id){
        throw new appError("id is required",400,responseStatus.FAILED)
       }
        const result=await deleteBook_S(id)
        res.status(200).json({
            status:"success",
            message:"Book Deleted Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getBook_C=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const id=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
       if(!id){
        throw new appError("id is required",400,responseStatus.FAILED)
       }
        const result=await getBook_S(id)
        res.status(200).json({
            status:"success",
            message:"Book Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const getBooks_C=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await getBooks_S(req.query)
        res.status(200).json({
            status:"success",
            message:"Books Found Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}