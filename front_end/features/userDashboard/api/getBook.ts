import { api } from "@/axios/api"
import { GetBookResponse } from "../types/book"

export const getBookA=async(id:string):Promise<GetBookResponse>=>{
    const res=await api.get(`/books/getBook/${id}`)
    return res.data

}