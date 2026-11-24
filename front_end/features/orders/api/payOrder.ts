import { api } from "@/axios/api"
import { PayOrderResponse } from "../types/orders"

export const payOrder=async(id:string,onlinePaymentMethod:number):Promise<PayOrderResponse>=>{
    const res=await api.post(`/order/payOrder/${id}`,{onlinePaymentMethod})
    return res.data
}