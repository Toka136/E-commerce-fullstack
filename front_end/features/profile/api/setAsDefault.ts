import { api } from "@/axios/api"

export const setAsDefault=async(addressId:string)=>{
    const res=await api.patch("address/setDefault",{
        addressId
    })
    return res.data
}