import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query";
import { DeleteBook } from "../api/deleteBook";
import { useRouter } from "next/navigation";

export const UseDeleteBook=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(id:string)=>DeleteBook(id),
        onSuccess:()=>{
            toast.success("Book deleted successfully")
            router.refresh()
        }
    })
}