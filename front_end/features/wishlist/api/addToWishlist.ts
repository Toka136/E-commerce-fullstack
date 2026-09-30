import { api } from "@/axios/api"

export const  addToWishlist=async(id:string)=>{
    const res = await api.post("/wishlist/addProduct",
        {
            productId:id
        }
    )
    return res

}