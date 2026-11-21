import { editAddressParams } from "../types/address"
import { api } from "@/axios/api"

export const editAddress=async(data:editAddressParams,addressId:string)=>{
    const res=await api.patch(`address/updateAddress/${addressId}`,data)
    return res.data

}