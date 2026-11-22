import { OrderItem } from "../../../generated/prisma/client";
import { FawaterakTransactionPayload } from "../../../Types/fawaterakTypes";
import appError from "../../../utils/errorClass";
import { responseStatus } from "../../../utils/responseStatus";
import { OrderWithRelations } from "../order.types";

export const prepareFawaterakPayload = (
  order: OrderWithRelations,
  paymentMethodId: number
): FawaterakTransactionPayload => {

  const user = order.user;
  const address = order.orderShippingAddress;

  if (!address) {
    throw new appError(
      "Shipping Address Not Found",
      400,
      responseStatus.FAILED
    );
  }

  const nameParts = user.userName.trim().split(/\s+/);

  const firstName = nameParts[0] || user.userName;
  const lastName = nameParts.slice(1).join(" ") || "-";

  const phone = address.mobile || user.phoneNumber;

  if (!phone) {
    throw new appError(
      "Customer Phone Is Required",
      400,
      responseStatus.FAILED
    );
  }

  const customerAddress = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.country,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
   

  return {
    payment_method_id: paymentMethodId,
    cartTotal: Number(order.totalPrice.toFixed(2)),
    currency: "EGP",

    customer: {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone,
      address: customerAddress,
      customer_number: user.id,
      customer_unique_id: user.id,
    },

    cartItems: [
    ...order.orderItems.map((item) => ({
      name: item.titleAtPurchase,
      price: Number(item.priceAtPurchase.toFixed(2)),
      quantity: item.quantity,
    })),
    {
      name: "Shipping",
      price: Number(order.shippingCost.toFixed(2)),
      quantity: 1,
    },
  ],

    pay_load: {
      order_id: order.id,
      customer_reference: user.id,
      shipping: Number(order.shippingCost.toFixed(2)),
    },

    redirectionUrls: {
      successUrl: process.env.FAWATERAK_SUCCESS_URL!,
      failUrl: process.env.FAWATERAK_FAIL_URL!,
      pendingUrl: process.env.FAWATERAK_PENDING_URL!,
      backUrl: process.env.FAWATERAK_BACK_URL!,
      webhookUrl: process.env.FAWATERAK_WEBHOOK_URL!,
    },
    discountData: {
    type: "literal",
    value: Number(order.discountAmount.toFixed(2)),
  },

    lang: "en",
  };
};