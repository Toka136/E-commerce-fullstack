import { NextFunction, Request, Response } from "express";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { addAddressS, deleteAddressS, getAddressesS, getAddressS, setAddressDefaultS, updateAddressS } from "./Address.service";

export const addAddressC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const address=req.body
        const newAddress=await addAddressS(address,userId)
        res.status(200).json({
            status:"success",
            message:"Address Added Successfully",
            data:newAddress
        })}catch(err){
            next(err)
    }
    
}

export const getAddressesC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
         const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        
        const address=await getAddressesS(userId)
        res.status(200).json({
            status:"success",
            message:"Address Found Successfully",
            data:address
        })}catch(err){
            next(err)
    }
    
}
export const getAddressC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
         const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const addressId=req.body.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const address=await getAddressS(userId,addressId)
        res.status(200).json({
            status:"success",
            message:"Address Found Successfully",
            data:address
        })}catch(err){
            next(err)
    }
    
}
export const updateAddressC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
        
        const address=req.body
        const addressId=Array.isArray(req.params.addressId)?req.params.addressId[0]:req.params.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const newAddress=await updateAddressS(addressId,address)
        res.status(200).json({
            status:"success",
            message:"Address Updated Successfully",
            data:newAddress
        })}catch(err){
            next(err)
    }
}
export const deleteAddressC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
        const addressId=Array.isArray(req.params.addressId)?req.params.addressId[0]:req.params.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const newAddress=await deleteAddressS(addressId)
        res.status(200).json({
            status:"success",
            message:"Address Deleted Successfully",
            data:newAddress
        })}catch(err){
            next(err)
    }
}
export const setAddressDefaultC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?.id
        if(!userId){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const addressId=Array.isArray(req.params.addressId)?req.params.addressId[0]:req.params.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const newAddress=await setAddressDefaultS(userId,addressId)
        res.status(200).json({
            status:"success",
            message:"Address Set as Default Successfully",
            data:newAddress
        })}catch(err){
            next(err)
    }
}
