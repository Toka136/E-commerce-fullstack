import { api } from "@/axios/api";

export const DeleteBook=async(id:string)=>{
    const res=await api.delete(`books/deleteBook/${id}`)
    return res.data
}