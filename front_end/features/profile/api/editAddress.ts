import { editAddressParams } from "../types/address"
import { api } from "@/axios/api"

export const editAddress=async(data:editAddressParams)=>{
    const res=await api.patch("address/updateAddress",data)
    return res.data

}