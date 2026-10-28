import { api } from "@/axios/api"

export const moveToCart=async(bookId:string)=>
{
    const res=await api.post("wishlist/moveToCart",{
        bookId:bookId
    })
    return res.data

}