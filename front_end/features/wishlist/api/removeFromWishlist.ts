import { api } from "@/axios/api"
export const deleteFromWishlist=async(bookId:string)=>
{
    const res=await api.delete("/wishlist/deleteBook",{
        data:{
      bookId:bookId  
        }
    })
    return res.data

}
