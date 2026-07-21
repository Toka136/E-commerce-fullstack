import { ClientSession } from "mongoose"
import orderModal from "./order.modal"
import { orderI } from "./order.types"

export const createOrder=async(order:orderI,session:ClientSession)=>{
    const newOrder=new orderModal(order)
    return await newOrder.save({session})
}
export const getOrdersByUserId=async(userId:string)=>{
    return await orderModal.find({userId})
}
export const findOrderById=async(id:string)=>{
    return await orderModal.findById(id)
}
export const updateOrderStatus=async(id:string,status:string)=>{
    return await orderModal.findByIdAndUpdate(id,{$set:{orderStatus:status,updatedAt:Date.now()}},{new:true})
}
export const updateOrderPaymentStatus=async(id:string,status:string)=>{
    return await orderModal.findByIdAndUpdate(id,{$set:{paymentStatus:status}},{new:true})
}