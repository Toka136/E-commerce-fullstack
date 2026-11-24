import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { paymentStatus } from "../Orders/order.types";
import { paymentI } from "./Payment.type";

export const createPayment = async (payment: paymentI) => {
  return await prisma.payment.create({
    data: {
      orderId: payment.orderId,
      amount: payment.amount,

     paymentMethod: payment.paymentMethod,
     ...(payment.intentKey !== undefined && {
     intentKey: payment.intentKey,
     }),
     ...(payment.paymentUrl !== undefined && {
     paymentUrl: payment.paymentUrl,
     }),
    ...(payment.referenceNumber !== undefined && {
    referenceNumber: payment.referenceNumber,
    }),

    ...(payment.systemReference !== undefined && {
    systemReference: payment.systemReference,
    }),

    ...(payment.isoQr !== undefined && {
    isoQr: payment.isoQr,
    }),

    ...(payment.expireDate !== undefined && {
    expireDate: payment.expireDate,
    }),
    },
  });
};
export const getPaymentByIntentKey=async(intentKey:string,tx:Prisma.TransactionClient)=>{
  return await tx.payment.findUnique({where:{intentKey}})
}
export const changePaymentStatus = async (
  intentKey: string,
  paymentStatus: paymentStatus,
  tx: Prisma.TransactionClient = prisma
) => {
  return await tx.payment.update({
    where: { intentKey },
    data: {
      status: paymentStatus,
    },
  });
};
export const findActivePendingPayment = async (orderId: string) => {
  return await prisma.payment.findFirst({
    where: {
      orderId,
      status: "PENDING",
      expireDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const expirePayment=async(id:string)=>{
  return await prisma.payment.update({where:{id},data:{expireDate:new Date(),status:"EXPIRED"}})
}
export const deletePayment=async(id:string)=>{
  return await prisma.payment.delete({where:{id}})
}
export const expirePendingPayments = async (orderId: string) => {
  return await prisma.payment.updateMany({
    where: {
      orderId,
      status: "PENDING",
      expireDate: {
        lte: new Date(),
      },
    },
    data: {
      status: "EXPIRED",
    },
  });
};
export const getPaymentById=async(id:string)=>{
  return await prisma.payment.findUnique({where:{id},include:{order:{select:{id:true,userId:true}}}})
}
export const getPaymentByOrderId = async (orderId: string) => {
  return await prisma.payment.findFirst({
    where: {
      orderId,
      status: "PENDING",
      expireDate: { gt: new Date() },
    },
    select: {
      id: true,
      expireDate: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};