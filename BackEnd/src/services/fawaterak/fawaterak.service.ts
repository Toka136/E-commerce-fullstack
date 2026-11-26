import axios from "axios";
import redis from "../../config/redis";
import { FawaterakTransactionPayload, FawaterakTransactionResponse } from "../../Types/fawaterakTypes";
import { Prisma } from "../../generated/prisma/client";
import { findOrderById, updateOrderPaymentStatus, updateOrderStatus } from "../../modules/Orders/order.repo";
import { changePaymentStatus, getPaymentByIntentKey } from "../../modules/Payment/Payment.repo";
import { int } from "zod";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { prisma } from "../../config/prisma";

const TOKEN_CACHE_KEY = "fawaterak:access_token";

export const getFawaterakAccessToken = async () => {
  // 1. Check Redis first
  const cachedToken = await redis.get(TOKEN_CACHE_KEY);

  if (cachedToken) {
    return cachedToken;
  }

  // 2. Request new token
  const response = await axios.post(
    process.env.FAWATERAK_TOKEN_URL!,
    {
      grant_type: "client_credentials",
      client_id: process.env.FAWATERAK_CLIENT_ID,
      client_secret: process.env.FAWATERAK_CLIENT_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("expires_in:", response.data.expires_in);

  const { access_token, expires_in } = response.data;

  // 3. Cache token in Redis
  // Keep a 60-second safety margin before expiration
  const ttl = Math.max(expires_in - 60, 1);

  await redis.set(TOKEN_CACHE_KEY, access_token, {
    ex: ttl,
  });

  return access_token;
};
export const getPaymentmethods=async()=>{
  const token=await getFawaterakAccessToken();
  const response=await axios.get(`${process.env.FAWATERAK_BASE_URL}getTrPaymentmethods`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
export const createFawaterakTransaction = async (
  payload: FawaterakTransactionPayload
): Promise<FawaterakTransactionResponse> => {
  try {
    const token = await getFawaterakAccessToken();
    console.log(
  "Redirect URLs:",
  JSON.stringify(payload.redirectionUrls, null, 2)
);
    const response = await axios.post(
      `${process.env.FAWATERAK_BASE_URL}createTransaction`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Fawaterak Error Status:", error.response?.status);
      console.error(
        "Fawaterak Error Response:",
        JSON.stringify(error.response?.data, null, 2)
      );
    }

    throw error;
  }
};
export const paidWebHookS = async (
  orderId: string,
  transactionKey: string,
  orderAmount: number
) => {
  return await prisma.$transaction(async (transaction) => {
    console.log("orderIdFawaterak",orderId)
    // 1. Find Order
    const order = await findOrderById(orderId, transaction);

    if (!order) {
      throw new appError(
        "Order Not Found",
        404,
        responseStatus.FAILED
      );
    }

    // 2. Find Payment
    const payment = await getPaymentByIntentKey(
      transactionKey,
      transaction
    );

    if (!payment || payment.orderId !== orderId) {
      throw new appError(
        "Payment Not Found",
        404,
        responseStatus.FAILED
      );
    }

    // 3. Idempotency Check
    if (payment.status === "COMPLETED") {
      return order;
    }
    if (order.paymentStatus === "COMPLETED") {
  return order;
}

    // 4. Validate Amount
    const expectedAmount = Math.round(
      Number(order.totalPrice) * 100
    );

    const receivedAmount = Math.round(orderAmount * 100);

    const paymentAmount = Math.round(
      Number(payment.amount) * 100
    );

    if (
      expectedAmount !== receivedAmount ||
      paymentAmount !== receivedAmount
    ) {
      throw new appError(
        "Order Amount Not Matched",
        400,
        responseStatus.FAILED
      );
    }

    // 5. Update Order & Payment
    await updateOrderPaymentStatus(
      order.id,
      "COMPLETED",
      transaction
    );

    await updateOrderStatus(
      order.id,
      "PROCESSING",
      transaction
    );

    await changePaymentStatus(
      payment.intentKey!,
      "COMPLETED",
      transaction
    );

    return order;
  });
};

export const failedWebHookS = async (
  orderId: string,
  transactionKey: string,
  orderAmount: number
) => {
  return await prisma.$transaction(async (transaction) => {
    console.log("orderIdFawaterak",orderId)
    // 1. Find Order
    const order = await findOrderById(orderId, transaction);

    if (!order) {
      throw new appError(
        "Order Not Found",
        404,
        responseStatus.FAILED
      );
    }

    // 2. Find Payment
    const payment = await getPaymentByIntentKey(
      transactionKey,
      transaction
    );

    if (!payment || payment.orderId !== orderId) {
      throw new appError(
        "Payment Not Found",
        404,
        responseStatus.FAILED
      );
    }

    // 3. Idempotency Check
    if (payment.status === "COMPLETED") {
      return order;
    }
    if (order.paymentStatus === "COMPLETED") {
  return order;
}

    // 4. Validate Amount
    const expectedAmount = Math.round(
      Number(order.totalPrice) * 100
    );

    const receivedAmount = Math.round(orderAmount * 100);

    const paymentAmount = Math.round(
      Number(payment.amount) * 100
    );

    if (
      expectedAmount !== receivedAmount ||
      paymentAmount !== receivedAmount
    ) {
      throw new appError(
        "Order Amount Not Matched",
        400,
        responseStatus.FAILED
      );
    }

    // 5. Update Order & Payment
    await updateOrderPaymentStatus(
      order.id,
      "FAILED",
      transaction
    );

    await updateOrderStatus(
      order.id,
      "PENDING",
      transaction
    );

    await changePaymentStatus(
      payment.intentKey!,
      "FAILED",
      transaction
    );

    return order;
  });
};
