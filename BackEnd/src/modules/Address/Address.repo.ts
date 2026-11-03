import { addAddressParams, updateAddressParams } from "./Address.types"
import {prisma} from "../../config/prisma"
import { Prisma } from "../../generated/prisma/client";
export const addAddress=async(address:addAddressParams)=>{
    const newAddress=await prisma.address.create({
        data:{...address.address,userId:address.userId}
    })
    return await newAddress
}
export const getAddresses=async(userId:string)=>{
    return await prisma.address.findMany({where:{userId}})
}
export const getAddress=async(addressId:string)=>{
    return await prisma.address.findUnique({where:{id:addressId}})
}
export const updateAddress=async(addressId:string,address:updateAddressParams)=>{
    return await prisma.address.update({
        where:{id:addressId},
        data:{...address}
    })
}
export const deleteAddress=async(addressId:string)=>{
    return await prisma.address.delete({where:{id:addressId}})
}
export const removeDefaultAddress=async(userId:string)=>{
    return await prisma.address.updateMany({where:{userId,isDefault:true},data:{isDefault:false}})
}

export const setAddressDefault=async(addressId:string)=>{
    return await prisma.address.update({where:{id:addressId},data:{isDefault:true}})
}
export const setAddressUnDefault=async(addressId:string)=>{
    return await prisma.address.update({where:{id:addressId},data:{isDefault:false}})
}
export const thereisDefault=async(userId:string)=>{
    return await prisma.address.findFirst({where:{userId,isDefault:true}})
}