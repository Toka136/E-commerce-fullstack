import { api } from "@/axios/api"
import { getBooksResponse, gteBooksParams } from "../types/books"
import { AxiosError } from "axios"

export const getBooksA=async({pageSize,currentPage,searchText,category,minPrice,maxPrice,sort}:gteBooksParams):Promise<getBooksResponse>=>{
  try{
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
  }catch(err){
    const error=err as AxiosError
    if (err instanceof AxiosError) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.response?.data);
    }
    throw error
  }

}