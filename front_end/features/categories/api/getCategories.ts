import { api } from "@/axios/api"
import { GetCategoriesResponse } from "../types/categories"

export const getCategoriesA=async():Promise<GetCategoriesResponse>=>{
    const res=await api.get(`/category/getCategories`)
    return res.data

}