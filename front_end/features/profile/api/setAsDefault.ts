import { api } from "@/axios/api"

export const setAsDefault=async(addressId:string)=>{
    console.log("addressId api",addressId);
    const res=await api.patch(`address/setDefault/${addressId}`)
    return res.data
}