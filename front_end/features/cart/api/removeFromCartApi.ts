import { api } from "@/axios/api"
import { CartResponse } from "../types/cart"
import { AxiosError } from "axios";

export const RemoveFromCartApi=async(productId:string):Promise<any>=>{
  try{
  const res=await api.patch("/cart/removeProductFromCart",{
    productId:productId,
  })
  console.log(res.data);
  return res.data}
  catch(err)
  {
      if (err instanceof AxiosError) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.response?.data?.message);
    }

    throw err;
  }
}
