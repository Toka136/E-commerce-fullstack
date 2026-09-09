import { api } from "@/axios/api"
import { editBookT } from "../types/Books"

export const EditBook=async(data:editBookT)=>{
    console.log("data from api",data)
    const formData=new FormData()
    formData.append("_id",data._id),
    data.title&&formData.append("title",data.title)
    data.author&&formData.append("author",data.author)
    data.slug&&formData.append("slug",data.slug)
    data.price&&formData.append("price",data.price.toString())
    data.description&&formData.append("description",data.description)
    data.pages&&formData.append("pages",data.pages.toString())
    data.coverImage&&formData.append("coverImage",data.coverImage)
    data.stock&&formData.append("stock",data.stock.toString())
    console.log("dataregform",formData)
    const res=await api.patch("books/updateBook",formData)
  
    return res.data
}