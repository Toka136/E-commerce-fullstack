import { api } from "@/axios/api"

export const getCoverImageUrl=async(id:string)=>{
    const res=await api.get(`Uploads/${id}`)
    return res.data
}