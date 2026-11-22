export interface FawaterakTransactionPayload {
  payment_method_id?: number;
  cartTotal: number;
  currency: string;

  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    customer_number?: string;
    customer_unique_id?: string;
  };

  cartItems: {
    name: string;
    price: number;
    quantity: number;
  }[];

  pay_load?: {
    order_id: string;
    customer_reference?: string;
    shipping: number,
  };

  redirectionUrls?: {
    successUrl: string;
    failUrl: string;
    pendingUrl: string;
    backUrl: string;
    webhookUrl: string;
  };

  sendEmail?: boolean;
  sendSMS?: boolean;
  due_date?: string;
  tr_number?: string;
  redirectOption?: boolean;
  authAndCapture?: number;

  taxData?: {
    title: string;
    value: number;
  };

  discountData?: {
    type: string;
    value: number;
  };

  list_style?: string;
  lang?: string;
  mobileWalletNumber?: string;
}
interface FawaterakBaseResponse {
  status: "success";
  message: string;
  data: {
    intent_key: string;
    expires_in: number;
  };
}

// Visa / Mastercard
interface CardPaymentResponse extends FawaterakBaseResponse {
  data: FawaterakBaseResponse["data"] & {
    payment_data: {
      redirectTo: string;
    };
  };
}

// Fawry / Aman / Masary
interface CashPaymentResponse extends FawaterakBaseResponse {
  data: FawaterakBaseResponse["data"] & {
    payment_data: {
      referenceNumber: string;
      expireDate: string;
      expirationTime: string;
    };
  };
}

// Mobile Wallet
interface WalletPaymentResponse extends FawaterakBaseResponse {
  data: FawaterakBaseResponse["data"] & {
    payment_data: {
      systemReference: string;
      isoQr: string;
    };
  };
}



export type FawaterakTransactionResponse =
  | CardPaymentResponse
  | CashPaymentResponse
  | WalletPaymentResponse;