import { authFetch } from "@/utils/authFetch";
import { editBookT } from "../types/Books";


export const GetSingleBook=async(id:string)=>{
   
    const res =await authFetch(`http://localhost:4000/api/books/getBook/${id}`,{
        method:"GET",
        credentials:"include"
    })
    const result = await res.json();
    console.log("result",result)
    if(!res.ok)
      throw new Error(result.message);
    return result
}


