export type PaymentMethod = "online" | "cod";

export interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}
export interface ShippingFormValues {
  
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobile: string;
}
export interface CreateOrderParams  {
  address:ShippingFormValues
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  data:{
  id: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  }
}


export interface OrderItem {
  id: string;
  bookId: string;
  quantity: number;
  priceAtPurchase: number;
  titleAtPurchase: string;
  imageAtPurchase: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  userId: string;
  orderShippingAddress: ShippingFormValues;
  orderItems: OrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingCost: number;
  subtotal: number;
  couponCode:string;
  discountAmount:number
}

export interface OrdersResponse {
  status: string;
  message: string;
  data: Order[];
}
export interface OrderResponse {
  status: string;
  message: string;
  data: Order;
}