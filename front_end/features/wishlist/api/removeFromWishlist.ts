import { api } from "@/axios/api"
export const deleteFromWishlist=async(productId:string)=>
{
    const res=await api.delete("/wishlist/deleteProduct",{
        data:{
      productId:productId  
        }
    })
    return res.data

}
