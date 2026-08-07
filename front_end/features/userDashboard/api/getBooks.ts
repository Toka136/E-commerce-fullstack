import { api } from "@/axios/api"
import { getBooksResponse, gteBooksParams } from "../types/books"

export const getBooksA=async({pageSize,currentPage,searchText}:gteBooksParams):Promise<getBooksResponse>=>{
    const res=await api.get("books/getBooks/",{
        params:{
            pageSize,
            currentPage,
            searchText
        }
    
    })
    return res.data

}