import { ObjectId } from "mongodb"
import { Prisma } from "../../generated/prisma/client";

export interface OrderItemI {
  bookId: string;
  quantity: number;
  priceAtPurchase: Prisma.Decimal;
  titleAtPurchase: string;
  imageAtPurchase: string;
}

export interface ShippingAddressI {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  mobile: string;
}
export type paymentMethod= "COD" | "ONLINE";
export type paymentStatus="PENDING" | "COMPLETED" | "FAILED";
export type orderStatus="PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export interface OrderI {
  userId: string;
  subtotal: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  shippingCost: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  couponCode?: string | null;

  paymentMethod: paymentMethod
  paymentStatus: paymentStatus
  orderStatus: orderStatus

  orderItems: OrderItemI[];
  orderShippingAddress: ShippingAddressI;
}