import { api } from "@/axios/api"

export const deleteAddress=async(addressId:string)=>{
    const res=await api.delete(`address/deleteAddress/${addressId}`)
    return res.data
}