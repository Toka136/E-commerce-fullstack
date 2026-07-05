import { toast } from "react-toastify";
import { AddBook } from "../api/booksApi";
import { addBookT } from "../types/Books";

export const UseAddBook=async(data:addBookT)=>{
    try{
        console.log("data",data)
        const res=await AddBook(data)
        toast.success("Book Added Successfully")
    return res
    }catch(err){
        console.log("err",err)
        const error=err as {message:string}
        toast.error(error.message)
    }
    
    
}