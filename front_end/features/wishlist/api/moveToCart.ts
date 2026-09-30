import { api } from "@/axios/api"

export const moveToCart=async(productId:string)=>
{
    const res=await api.post("wishlist/moveToCart",{
        productId:productId
    })
    return res.data

}