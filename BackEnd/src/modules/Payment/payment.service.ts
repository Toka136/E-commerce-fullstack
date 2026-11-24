import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { findOrderById } from "../Orders/order.repo"
import { getPaymentById } from "./Payment.repo"

export const getPaymentDetailsS=async(userId:string,paymentId:string)=>{
    const payment=await getPaymentById(paymentId)
    if(!payment){
       throw new appError("Payment not found",404,responseStatus.FAILED)
    }
    const order=await findOrderById(payment.orderId)
    if(!order){
        throw new appError("Order not found",404,responseStatus.FAILED)
    }
    if(order.userId!==userId){
        throw new appError("You are not authorized to access this payment",403,responseStatus.FAILED)
    }
    return payment
}