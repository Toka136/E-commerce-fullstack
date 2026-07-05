import { authFetch } from "@/utils/authFetch";
import { addBookT, bookParams, bookT, editBookT } from "../types/Books";

export const GetBooks=async({pageSize,currentPage,searchText}:bookParams)=>{
    const urlParams=new URLSearchParams()
    if(pageSize)
    urlParams.append("pageSize",pageSize.toString())
    if(currentPage)
    urlParams.append("currentPage",currentPage.toString())
    if(searchText)
    urlParams.append("searchText",searchText)
    const res =await authFetch(`http://localhost:4000/api/books/getBooks/?${urlParams}`,{
        method:"GET",
        credentials:"include"
    })
    const result = await res.json();
    if(!res.ok)
      throw new Error(result.message);
    return result
}
export const GetSingleBook=async(id:string)=>{
   
    const res =await authFetch(`http://localhost:4000/api/books/getBook/${id}`,{
        method:"GET",
        credentials:"include"
    })
    const result = await res.json();
    if(!res.ok)
      throw new Error(result.message);
    return result
}
export const AddBook=async(data:addBookT)=>{
    console.log("data from api",data)
    const formData=new FormData()
    formData.append("title",data.title)
    formData.append("author",data.author)
    formData.append("genre",data.genre)
    formData.append("price",data.price.toString())
    formData.append("description",data.description)
    data.coverImage&&formData.append("coverImage",data.coverImage)
    formData.append("stock",data.stock.toString())
    console.log("dataregform",formData)
    const res=await authFetch("http://localhost:4000/api/books/addBook",{
        method:"POST",
        body:formData,
        credentials:"include"
    })
    const result = await res.json();
    if(result.ok===false)
      throw new Error(result.message);
    return result
}
export const EditBook=async(data:editBookT)=>{
    console.log("data from api",data)
    const formData=new FormData()
    formData.append("_id",data._id),
    formData.append("title",data.title)
    formData.append("author",data.author)
    formData.append("genre",data.genre)
    formData.append("price",data.price.toString())
    formData.append("description",data.description)
    data.coverImage&&formData.append("coverImage",data.coverImage)
    formData.append("stock",data.stock.toString())
    console.log("dataregform",formData)
    const res=await authFetch("http://localhost:4000/api/books/updateBook",{
        method:"PATCH",
        body:formData,
    })
    const result = await res.json();
    if(result.ok===false)
      throw new Error(result.message);
    return result
}
export const DeleteBook=async(id:string)=>{
    const res=await authFetch(`http://localhost:4000/api/books/deleteBook/${id}`,{
        method:"DELETE",
    })
    const result = await res.json();
    if(result.ok===false)
      throw new Error(result.message);
    return result
}