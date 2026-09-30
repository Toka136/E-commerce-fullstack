import { api } from "@/axios/api"
import { addBookT } from "../types/Books"

export const AddBook=async(data:addBookT)=>{
    console.log("data from api",data)
    const formData=new FormData()
    formData.append("title",data.title)
    formData.append("author",data.author)
    formData.append("slug",data.slug)
    formData.append("price",data.price.toString())
    formData.append("pages",data.pages.toString())
    formData.append("description",data.description)
    data.coverImage&&formData.append("coverImage",data.coverImage)
    formData.append("stock",data.stock.toString())
    const res=await api.post("books/addBook",formData)
  
    return res.data
}