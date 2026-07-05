import { toast } from "react-toastify"
import { DeleteBook } from "../api/booksApi"

export const UseDeleteBook=async(id:string)=>{
    try{
        const res=await DeleteBook(id)
        toast.success("Book Deleted Successfully")
        return res

    }catch(err){
        console.log("err",err)
        const error=err as {message:string}
        toast.error(error.message)
    }
}