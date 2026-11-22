import { prisma } from "../../config/prisma";
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