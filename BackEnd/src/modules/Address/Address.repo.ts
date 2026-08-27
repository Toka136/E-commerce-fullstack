import AddressModal from "./Address.modal"
import { addAddressParams, updateAddressParams } from "./Address.types"

export const addAddress=async(address:addAddressParams)=>{
    console.log("address repo",address)
    const newAddress=new  AddressModal({...address.address,userId:address.userId}) 
    return await newAddress.save()
}
export const getAddresses=async(userId:string)=>{
    return await AddressModal.find({userId})
}
export const getAddress=async(addressId:string)=>{
    return await AddressModal.findById(addressId)
}
export const updateAddress=async(addressId:string,address:updateAddressParams)=>{
    return await AddressModal.findByIdAndUpdate(addressId,address,{new:true})
}
export const deleteAddress=async(addressId:string)=>{
    return await AddressModal.findByIdAndDelete(addressId)
}
export const removeDefaultAddress=async(userId:string)=>{
    return await AddressModal.updateMany({userId},{isDefault:false})
}
export const setAddressDefault=async(addressId:string)=>{
    return await AddressModal.findByIdAndUpdate(addressId,{isDefault:true},{new:true})
}
export const setAddressUnDefault=async(addressId:string)=>{
    return await AddressModal.findByIdAndUpdate(addressId,{isDefault:false},{new:true})
}