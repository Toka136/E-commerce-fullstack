import { api } from "@/axios/api"
import { AddCategoryReq } from "../types/categories"

export const addCategory=async(data:AddCategoryReq)=>{
    const res=await api.post("/category/addCategory",data)
    return res.data
}