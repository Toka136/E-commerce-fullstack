import { toast } from "react-toastify";
import {  EditBook } from "../api/booksApi";
import {  editBookT } from "../types/Books";

export const UseEditBook=async(data:editBookT)=>{
    try{
        console.log("data edit",data)
        const res=await EditBook(data)
        toast.success("Book Edited Successfully")
    return res
    }catch(err){
        console.log("err",err)
        const error=err as {message:string}
        toast.error(error.message)
    }
    
    
}