import { api } from "@/axios/api"
import { OrderStatus } from "@/features/orders/types/orders"
import { AxiosError } from "axios"

export const cancelOrder = async (id: string) => {
  const res = await api.patch(`/order/cancelOrder/${id}`, {
  })
  return res.data
 
}