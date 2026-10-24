import { api } from "@/axios/api"
import { GetBookResponse } from "../types/book"

export const getBookA=async(id:string):Promise<GetBookResponse>=>{
    try{
    const res=await api.get(`/books/getBook/${id}`)
    console.log("book",res.data)
    return res.data
    }catch (err){
        throw err
    }

}