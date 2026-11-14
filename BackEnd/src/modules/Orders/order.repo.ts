import {prisma} from "../../config/prisma"
import { orderStatus, paymentStatus, Prisma } from "../../generated/prisma/client";
import { OrderI } from "./order.types"

export const createOrder = async (
  order: OrderI,
  tx: Prisma.TransactionClient = prisma
) => {
  return await tx.order.create({
    data: {
      userId: order.userId,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingCost: order.shippingCost,
      totalPrice: order.totalPrice,
      couponCode: order.couponCode?? null,

      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,

      orderItems: {
        create: order.orderItems,
      },

      orderShippingAddress: {
        create: order.orderShippingAddress,
      },
    },
    include: {
      orderItems: true,
      orderShippingAddress: true,
    },
  });
};
export const getOrdersByUserId=async(userId:string)=>{
    return await prisma.order.findMany({
      where:{userId},
      orderBy: { createdAt: "desc" },
      include:{
        orderItems:true,
        orderShippingAddress:true
      }
    })
}
export const getOrders=async()=>{
    return await prisma.order.findMany({
      orderBy:{createdAt:"desc"},
      include:{
        orderItems:true,
        orderShippingAddress:true
      }
    })
}
export const findOrderById=async(id:string)=>{
    return await prisma.order.findUnique({where:{id},include:{orderItems:true,orderShippingAddress:true}})
}
export const updateOrderStatus=async(id:string,orderStatus:orderStatus)=>{
   await prisma.order.update({where:{id},data:{orderStatus:orderStatus}})
}
export const updateOrderPaymentStatus=async(id:string,paymentStatus:paymentStatus)=>{
  await prisma.order.update({where:{id},data:{paymentStatus:paymentStatus}})
}
// export const getRevenue=async()=>{
//    return await orderModal.aggregate([
//             { $match: { paymentStatus: "completed" } },
//             { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//           ])
// }
// export const getCurrentMRevenue=async(startOfCurrentMonth:Date)=>{
//     return orderModal.aggregate([
//             { 
//               $match: { 
//                 paymentStatus: "completed", 
//                 createdAt: { $gte: startOfCurrentMonth } 
//               } 
//             },
//             { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//           ])
// }
// export const getPrevMRevenue=async(startOfPreviousMonth:Date,endOfPreviousMonth:Date)=>{
//     return orderModal.aggregate([
//             { 
//               $match: { 
//                 paymentStatus: "completed", 
//                 createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } 
//               } 
//             },
//             { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//           ])
// }
// export const getPendingRevenue=async()=>{
//     return  orderModal.countDocuments({ 
//         paymentStatus: "completed", 
//         orderStatus: { $in: ["pending", "processing"] } 
//       })
// }