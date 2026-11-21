import { apiServer } from "@/axios/apiServer";
import { OrderResponse, OrdersResponse } from "../types/orders";

export async function getOrderApi(id:string): Promise<OrderResponse> {
  const res = await apiServer.get(`/order/getOrder/${id}`);
  console.log("order",res.data)
 
  return res.data;
}