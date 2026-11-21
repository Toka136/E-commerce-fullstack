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
      couponId: order.couponId,
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
export const findOrderById=async(id:string,tx:Prisma.TransactionClient=prisma)=>{
    return await tx.order.findUnique({where:{id},include:{orderItems:true,orderShippingAddress:true,}})
}
export const updateOrderStatus=async(id:string,orderStatus:orderStatus)=>{
   await prisma.order.update({where:{id},data:{orderStatus:orderStatus}})
}
export const cancelOrder = async (
  id: string,
  tx: Prisma.TransactionClient = prisma
) => {
  return await tx.order.updateMany({
    where: {
      id,
      orderStatus: {
        notIn: ["DELIVERED", "CANCELLED"],
      },
    },
    data: {
      orderStatus: "CANCELLED",
    },
  });
};
export const updateOrderPaymentStatus=async(id:string,paymentStatus:paymentStatus)=>{
  await prisma.order.update({where:{id},data:{paymentStatus:paymentStatus}})
}
export const getRevenue = async () => {
  const result = await prisma.order.aggregate({
    where: {
      paymentStatus: "COMPLETED",
    },
    _sum: {
      totalPrice: true,
    },
  });

  return result._sum.totalPrice ?? 0;
};
export const getCurrentMRevenue=async(startOfCurrentMonth:Date)=>{
    const result = await prisma.order.aggregate({
    where: {
      paymentStatus: "COMPLETED",
      createdAt:{gte:startOfCurrentMonth}
    },
    _sum: {
      totalPrice: true,
    },
  });

  return result._sum.totalPrice ?? 0;
    
}
export const getPrevMRevenue=async(startOfPreviousMonth:Date,endOfPreviousMonth:Date)=>{
    const result = await prisma.order.aggregate({
    where: {
      paymentStatus: "COMPLETED",
      createdAt:{gte:startOfPreviousMonth,lt:endOfPreviousMonth}
    },
    _sum: {
      totalPrice: true,
    },
  });

  return result._sum.totalPrice ?? 0;
}
export const getPendingRevenue = async () => {
  const result = await prisma.order.aggregate({
    where: {
      paymentStatus: "PENDING",
      orderStatus: {in:["PENDING","PROCESSING"]},
    },
    _sum: {
      totalPrice: true,
    },
  });

  return result._sum.totalPrice ?? 0;
};