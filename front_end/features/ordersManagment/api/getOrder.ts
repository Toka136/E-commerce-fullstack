import { apiServer } from "@/axios/apiServer"
import { Order } from "@/features/orders/types/orders"

export interface OrderDetailResponse {
  status: string
  message: string
  data: Order
}

// NOTE: this route doesn't share the "order/" prefix the other two endpoints
// do — double check this matches your actual backend route.
export const getOrder = async (id: string): Promise<OrderDetailResponse> => {
  const res = await apiServer.get(`/order/getOrder/${id}`)
  return res.data
}
