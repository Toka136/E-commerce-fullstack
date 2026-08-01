import { Request, Response, NextFunction } from "express";
import { addCategoryS, deleteCategoryS, getCategoriesS, getCategoryS, updateCategoryS } from "./Category.service";
import { categoryI } from "./Category.types";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
export const addCategoryC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        console.log("req.body",req.body)
       const category: categoryI = {
        name: req.body.name,
        description: req.body.description,
        slug:"",
      };
  
     
    const newCategory=await addCategoryS(category)
     res.status(200).json({
        status:"success",
        message:"Category Added Successfully",
        data:newCategory
    })
    }catch(err){
        next(err)
    }
}
export const getCategoriesC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const categories=await getCategoriesS()
        res.status(200).json({
            status:"success",
            message:"Categories Found Successfully",
            data:categories
        })
    }catch(err){
        next(err)
    }
}
export const getCategoryC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const slug=Array.isArray(req.params.slug)?req.params.slug[0]:req.params.slug
        if(!slug){
            throw new appError("slug is required",400,responseStatus.FAILED)
        }
        const category=await getCategoryS(slug)
        res.status(200).json({
            status:"success",
            message:"Category Found Successfully",
            data:category
        })
    }catch(err){
        next(err)
    }
}
export const deleteCategoryC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const id=Array.isArray(req.params.id)?req.params.id[0]:req.params.id
        if(!id){
            throw new appError("id is required",400,responseStatus.FAILED)
        }
        const result=await deleteCategoryS(id)
        res.status(200).json({
            status:"success",
            message:"Category Deleted Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}
export const updateCategoryC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const slug=Array.isArray(req.params.slug)?req.params.slug[0]:req.params.slug
        const description=req.body.description
        if(!slug){
            throw new appError("slug is required",400,responseStatus.FAILED)
        }
                console.log("slug",slug)

        const result=await updateCategoryS(slug,description)
        res.status(200).json({
            status:"success",
            message:"Category Updated Successfully",
            data:result
        })
    }catch(err){
        next(err)
    }
}