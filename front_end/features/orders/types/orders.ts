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
export type PaymentProvider = "FAWATERAK" | string;

export interface PaymentIntent {
  id: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  intentKey: string;
  isoQr: string | null;
  orderId: string;
  paymentMethod: number;
  paymentUrl: string;
  provider: PaymentProvider;
  referenceNumber: string | null;
  status: PaymentStatus | string;
  systemReference: string | null;
}
export interface orderResponseC {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod:PaymentMethod
}
export interface CreateOrderResponse {
  status: string;
  message: string;
  data:orderResponseC
}
export interface PayOrderResponse {
  status: string;
  message: string;
  data: PaymentIntent;
  
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

export type PaymentStatus = "pending" | "completed" | "failed";

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
  data: {
    order: Order;
    payment: {
      id: string;
      expireDate: string | null;
    } | null;
  };
}
export interface onlinePaymentMethod {
  payment_method_id: number;
  name_en: string;
  name_ar: string;
  redirect: "true" | "false";
  logo: string;
  commission_on_customer: number;
  integration_status: number;
}

export interface VendorSettings {
  custome_iframe_title: string | null;
}

export interface PaymentMethodsResponse {
  status: "success";
  vendorSettingsData: VendorSettings;
  data: onlinePaymentMethod[];
}
export interface PaymentMethodsApiResponse {
  status: string;
  message: string;
  data: PaymentMethodsResponse;
}
export interface PaymentDetails {
  id: string;
  orderId: string;
  expireDate: string | null;

  provider: string;
  paymentMethod: number;

  intentKey: string | null;
  paymentUrl: string | null;

  referenceNumber: string | null;
  systemReference: string | null;
  isoQr: string | null;

  amount: string;
  status: PaymentStatus;

  createdAt: string;
  updatedAt: string;

  order: {
    id: string;
    userId: string;
  };
}
export interface PaymentDetailsRespons{
  status: string;
  message: string;
  data: PaymentDetails
}
