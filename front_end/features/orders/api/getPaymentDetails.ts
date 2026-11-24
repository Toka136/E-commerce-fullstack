import { api } from "@/axios/api"
import { PaymentDetailsRespons } from "../types/orders"
import { apiServer } from "@/axios/apiServer"

export const getPaymenDetails=async(id:string):Promise<PaymentDetailsRespons>=>{
    const res=await apiServer.get(`/payment/getPaymenDetails/${id}`)
    return res.data
}