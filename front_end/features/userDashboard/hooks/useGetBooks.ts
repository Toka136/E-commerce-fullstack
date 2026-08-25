import { useQuery } from "@tanstack/react-query";
import { getBooksA } from "../api/getBooks";
import { gteBooksParams } from "../types/books";
import { AxiosError } from "axios";

export const useGetBooks = async (params: gteBooksParams) => {
  try{
    const res=await getBooksA(params)
    return {res,error:null,isLoading:false}
  }catch(err){
    console.log(err);
    const error=err as AxiosError
      if (err instanceof AxiosError) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.response?.data?.message);
    }
    
  }
  
};