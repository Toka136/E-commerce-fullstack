import { apiServer } from "@/axios/apiServer"
import { OrdersResponse } from "@/features/orders/types/orders"
import { AxiosError } from "axios"

export const getOrders = async (): Promise<OrdersResponse> => {
  try {
    const res = await apiServer.get("order/getOrders")
    return res.data
  } catch (error) {
    const err=error as AxiosError
    if (err instanceof AxiosError) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.response?.data);
    }
    throw error
  }
}