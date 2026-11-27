import { api } from "@/axios/api";
import { CreateOrderParams, CreateOrderResponse } from "../types/orders";

export const createOrder = async (
  data: CreateOrderParams,
  idempotencyKey: string
): Promise<CreateOrderResponse> => {
  console.log("idempotencyKey", idempotencyKey);
  const res = await api.post(
    "/order/createOrder",
    {
      ...data,
      paymentMethod: data.paymentMethod.toUpperCase(),
    },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return res.data;
};