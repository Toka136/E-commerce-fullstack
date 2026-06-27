import { NextFunction, Request, Response } from "express";
import { authResponse, UserData } from "./Auth.types";
import { S_login, S_refreshToken, S_register } from "./Auth.service";
export const C_register=async(req:Request,res:Response,next:NextFunction)=>{
    console.log("in function")
    console.log("req.body",req.body)
    try{

    const user:authResponse=await S_register(req.body,req.file)
    res.cookie("accessToken",user.accessToken,{
         httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000 
    })
    res.cookie("refreshToken",user.refreshToken,{
        httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({
        status:"success",
        message:"User Created Successfully",
        data:user
    })
    }catch(err){
        next(err)
    }
}
export const C_login=async(req:Request,res:Response,next:NextFunction)=>{
    console.log("req.body login",req.body)
    try{
        const user:authResponse=await S_login(req.body)
        res.cookie("accessToken",user.accessToken,{
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000 
        })
        res.cookie("refreshToken",user.refreshToken,{
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            status:"success",
            message:"User Logged In Successfully",
            data:user
        })
    }catch(err){
        next(err)
    }
    }
    export const C_logout=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")
            res.status(200).json({
                status:"success",
                message:"User Logged Out Successfully"
            })
        }catch(err){
            next(err)
        }
    }
    export const C_refreshToken=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const user:authResponse=await S_refreshToken(req.cookies.refreshToken)
            res.cookie("accessToken",user.accessToken,{
                httpOnly: true,
                secure: false, 
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000 
            })
            res.cookie("refreshToken",user.refreshToken,{
                httpOnly: true,
                secure: false, 
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                status:"success",
                message:"User Logged In Successfully",
                data:user
            })}catch(err){
                next(err)
            }
        }
