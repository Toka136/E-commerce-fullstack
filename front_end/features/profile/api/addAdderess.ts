import { api } from "@/axios/api";
import { CreateAddressParams } from "../types/address";

export const addAddressApi=async(data:CreateAddressParams)=>{
    const res=await api.post("address/addAddress",data)
    return res.data
}