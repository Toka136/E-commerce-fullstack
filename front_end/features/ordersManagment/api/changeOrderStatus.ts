import { api } from "@/axios/api"
import { OrderStatus } from "@/features/orders/types/orders"
import { AxiosError } from "axios"

export const changeOrderStatus = async (id: string, orderStatus: OrderStatus) => {
 try {
  const res = await api.patch(`/order/changeOrderStatus/${id}`, {
   status: orderStatus,
  })
  return res.data
 }catch (error) {
  const err=error as AxiosError
  if (err instanceof AxiosError) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.response?.data);
  }
  throw error
 }
}
