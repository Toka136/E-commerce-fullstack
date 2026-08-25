import { api } from "@/axios/api"
import { getBooksResponse, gteBooksParams } from "../types/books"

export const getBooksA=async({pageSize,currentPage,searchText,category,minPrice,maxPrice,sort}:gteBooksParams):Promise<getBooksResponse>=>{
    console.log("category",category)
    const res=await api.get("books/getBooks/",{
        params:{
            pageSize:pageSize??2,
            currentPage:currentPage??1,
            searchText:searchText??"",
            category:category??"",
            minPrice:minPrice??0,
            maxPrice:maxPrice??1000000,
            sort:sort??"null"
        }
    
    })
    return res.data

}