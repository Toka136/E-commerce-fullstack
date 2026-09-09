import { toast } from "react-toastify";
import { addBookT, editBookT } from "../types/Books";
import { useMutation } from "@tanstack/react-query";
import { AddBook } from "../api/addBook";
import { useRouter } from "next/navigation";
import { EditBook } from "../api/editBook";

export const UseEditBook=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:editBookT)=>EditBook(data),
        onSuccess:()=>{
            toast.success("Book added successfully")
            router.refresh()
        }
    })
    
}