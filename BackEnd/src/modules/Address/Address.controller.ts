import { NextFunction, Request, Response } from "express";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { addAddressS, deleteAddressS, getAddressesS, getAddressS, setAddressDefaultS, updateAddressS } from "./Address.service";

export const addAddressC=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies.accessToken
        if(!token){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const address=req.body
        console.log("address",address)
        const newAddress=await addAddressS(address,token)
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
        const token=req.cookies.accessToken
        if(!token){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const address=await getAddressesS(token)
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
        const token=req.cookies.accessToken
        if(!token){
            throw new appError("You are not logged in",401,responseStatus.FAILED)
        }
        const addressId=req.body.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const address=await getAddressS(token,addressId)
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
        console.log("address",address)
        const newAddress=await updateAddressS(address)
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
        
        const addressId=req.body.addressId
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
        const addressId=req.body.addressId
        if(!addressId){
            throw new appError("Address Id is required",400,responseStatus.FAILED)
        }
        const newAddress=await setAddressDefaultS(userId.toString(),addressId)
        res.status(200).json({
            status:"success",
            message:"Address Set as Default Successfully",
            data:newAddress
        })}catch(err){
            next(err)
    }
}
