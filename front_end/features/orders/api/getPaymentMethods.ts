import { api } from "@/axios/api"
import { PaymentMethodsApiResponse, PaymentMethodsResponse } from "../types/orders"

export const getOPaymentMethods=async():Promise<PaymentMethodsApiResponse>=>{
    const res=await api.get("/payment/getPaymentMethods")
    return res.data
}