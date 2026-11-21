import { api } from "@/axios/api"
import { CartResponse } from "../types/cart"
import { AxiosError } from "axios";

export const applyCoupon=async(couponCode:string):Promise<CartResponse>=>{
  try{
  const res=await api.patch("/cart/applyCoupon",{
    couponCode
  })
  console.log(res.data);
  return res.data}
  catch(err)
  {
    const error=err as AxiosError
      if (err instanceof AxiosError) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.response?.data?.message);
    }

    throw err;
  }
}
