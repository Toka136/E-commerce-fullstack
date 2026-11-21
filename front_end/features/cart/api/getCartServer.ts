import { api } from "@/axios/api"
import { CartResponse } from "../types/cart"
import { AxiosError } from "axios";
import { apiServer } from "@/axios/apiServer";

export const getCartServer=async():Promise<CartResponse>=>{
  try{
  const res=await apiServer.get("/cart/getCart")
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
