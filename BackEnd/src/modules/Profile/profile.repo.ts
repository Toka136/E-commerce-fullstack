import { updateProfileI } from "./profile.types"
import { prisma } from "../../config/prisma";
export const getUserProfile=async(userId:string)=>{
    return await prisma.user.findUnique({
        where:{id:userId}
    })
}
export const updateUserProfile=async(userId:string,updateData:updateProfileI)=>{
    return await prisma.user.update({
        where:{id:userId},
        data:updateData
    })
}
export const verifyUser=async(userId:string)=>{
    return await prisma.user.update({
        where:{id:userId},
        data:{verified:true}
    })
}
export const updatePassword=async(userId:string,password:string)=>{
    return await prisma.user.update({
        where:{id:userId},
        data:{password}
    })
}
export const findUser=async(email:string)=>{
    return await prisma.user.findUnique({
        where:{email}
    })
}