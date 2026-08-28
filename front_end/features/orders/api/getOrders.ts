import { apiServer } from "@/axios/apiServer";
import { OrdersResponse } from "../types/orders";

export async function getOrdersApi(): Promise<OrdersResponse> {
  const res = await apiServer.get("/order/getOrders");
 
  return res.data;
}