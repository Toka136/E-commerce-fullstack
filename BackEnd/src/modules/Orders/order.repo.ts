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
export const getOrders=async()=>{
    return await orderModal.find().sort({createdAt:-1})
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
export const getRevenue=async()=>{
   return await orderModal.aggregate([
            { $match: { paymentStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ])
}
export const getCurrentMRevenue=async(startOfCurrentMonth:Date)=>{
    return orderModal.aggregate([
            { 
              $match: { 
                paymentStatus: "completed", 
                createdAt: { $gte: startOfCurrentMonth } 
              } 
            },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ])
}
export const getPrevMRevenue=async(startOfPreviousMonth:Date,endOfPreviousMonth:Date)=>{
    return orderModal.aggregate([
            { 
              $match: { 
                paymentStatus: "completed", 
                createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } 
              } 
            },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ])
}
export const getPendingRevenue=async()=>{
    return  orderModal.countDocuments({ 
        paymentStatus: "completed", 
        orderStatus: { $in: ["pending", "processing"] } 
      })
}