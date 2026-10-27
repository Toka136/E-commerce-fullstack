import { api } from "@/axios/api"
import { GetWishlistResponse } from "../types/wishlist"
import { AxiosError } from "axios"

export const  getWishlistA=async():Promise<GetWishlistResponse>=>{
   const res = await api.get("/wishlist/getWishList")
   console.log("res",res.data);
    return res.data


}