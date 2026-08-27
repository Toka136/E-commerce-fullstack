import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { GetUserInfo } from "../../utils/userInfo"
import { addAddress, deleteAddress, getAddress, getAddresses, removeDefaultAddress, setAddressDefault, setAddressUnDefault, updateAddress } from "./Address.repo"
import { address, updateAddressParams } from "./Address.types"

export const addAddressS=async(address:address,token:string)=>{
    const userInfo=await GetUserInfo(token)
    if(!userInfo){
        throw new appError("Invalid Token",400,responseStatus.FAILED)
    }
    const userId=userInfo.id.toString()
    console.log("addressSS",address)
    const newAddress=await addAddress({address,userId})
    return newAddress
    
}
export const getAddressesS=async(token:string)=>{
    const userInfo=await GetUserInfo(token)
    if(!userInfo){
        throw new appError("Invalid Token",400,responseStatus.FAILED)
    }
    const userId=userInfo.id.toString()
    const address=await getAddresses(userId)
    return address
}
export const getAddressS=async(token:string,addressId:string)=>{
    const userInfo=await GetUserInfo(token)
    if(!userInfo){
        throw new appError("Invalid Token",400,responseStatus.FAILED)
    }
    const userId=userInfo.id.toString()
    const address=await getAddress(addressId)
    if(address && address.userId.toString()!==userId){
        throw new appError("You are not authorized",403,responseStatus.FAILED)
    }
    
    return address
}
export const updateAddressS=async(address:updateAddressParams)=>{
    const updatedAddress=await updateAddress(address.addressId,{...address,updatedAt:new Date()})
    return updatedAddress
}
export const setAddressDefaultS=async(userId:string,addressId:string)=>{
    await removeDefaultAddress(userId)
    return await setAddressDefault(addressId)
}
export const setAddressUnDefaultS=async(addressId:string)=>{
    return await setAddressUnDefault(addressId)
} 
export const deleteAddressS=async(addressId:string)=>{
    return await deleteAddress(addressId)
}