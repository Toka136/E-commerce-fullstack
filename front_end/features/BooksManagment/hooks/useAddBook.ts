import { toast } from "react-toastify";
import { addBookT } from "../types/Books";
import { useMutation } from "@tanstack/react-query";
import { AddBook } from "../api/addBook";
import { useRouter } from "next/navigation";

export const UseAddBook=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:addBookT)=>AddBook(data),
        onSuccess:()=>{
            toast.success("Book added successfully")
            router.refresh()
        }
    })
    
}