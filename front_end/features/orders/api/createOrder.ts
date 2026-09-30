import { api } from "@/axios/api";
import { CreateOrderParams, CreateOrderResponse } from "../types/orders";

export const createOrder=async(data:CreateOrderParams):Promise<CreateOrderResponse>=>{
    const res=await api.post("/order/createOrder",data)
    console.log("order res",res.data);
    return res.data
}