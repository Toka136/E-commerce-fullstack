
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Tag,
} from "lucide-react";

import { getOrderApi } from "@/features/orders/api/getOrder";
import { StatusTracker } from "@/features/orders/components/statusTracker";
import OrderStatusBadge from "@/features/orders/components/ordersStatusBadge";
import  { Thumbnail } from "@/features/orders/components/OrderItemThumbnails";
import { formatPrice, formatPublishedDate } from "@/features/userDashboard/utils/format";
import { Card } from "@/features/orders/components/Card";
import { OrderStatus, PaymentStatus } from "@/features/orders/types/orders";

const PAYMENT_STYLES: Record<PaymentStatus, { label: string; className: string }> = {
  completed: { label: "Paid", className: "bg-green-100 text-green-800" },
  pending: { label: "Payment pending", className: "bg-amber-100 text-amber-800" },
  failed: { label: "Payment failed", className: "bg-red-100 text-red-800" },
};

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className={muted ? "text-on-surface-variant" : "text-on-surface"}>{label}</dt>
      <dd className={muted ? "text-on-surface-variant" : "text-on-surface"}>{value}</dd>
    </div>
  );
}

type params={
        params:Promise<{id:string}>
    }

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function SingleOrderPage({params}:params) {
  const id=(await params).id
  const {data:order}=await getOrderApi(id);
const paymentStyle = PAYMENT_STYLES[
  order.order.paymentStatus.toLocaleLowerCase() as PaymentStatus
];  const itemCount = order.order.orderItems.reduce((n, i) => n + i.quantity, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <Link
        href="/orders"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface  focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        All orders
      </Link>

      {/* Header */}
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">
            Order #{order.order.id.slice(-8)}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Placed on {formatPublishedDate(order.order.createdAt)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${paymentStyle.className}`}
          >
            {paymentStyle.label}
          </span>
          <OrderStatusBadge status={order.order.orderStatus} />
        </div>
      </header>

      {/* Tracker */}
      <div className="mb-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-6">
        <StatusTracker status={order.order.orderStatus.toLocaleLowerCase() as OrderStatus} />
        {order.order.orderStatus !== "cancelled" && (
          <p className="mt-4 text-xs text-on-surface-variant">
            Last updated {formatPublishedDate(order.order.updatedAt)}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <Card title="Items">
            <ul className="divide-y divide-outline-variant/30">
              {order.order.orderItems.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <Thumbnail item={item} />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/books/${item.bookId}`}
                        className="line-clamp-2 text-sm font-medium text-on-surface hover:underline"
                      >
                        {item.titleAtPurchase}
                      </Link>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {formatPrice(item.priceAtPurchase)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Summary">
            <dl className="space-y-2.5">
              <SummaryRow label="Subtotal" value={formatPrice(order.order.subtotal)} muted />
              <SummaryRow label="Shipping" value={formatPrice(order.order.shippingCost)} muted />
              {order.order.couponCode && (
                <div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="flex items-center gap-1.5 text-on-surface-variant">
                    <Tag className="h-3.5 w-3.5" />
                    Coupon
                  </dt>
                  <dd className="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-on-surface">
                    {order.order.couponCode}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm mt-4 ">
                  <dt className="flex items-center gap-1.5 text-on-surface-variant ">
                    Discount Amount
                  </dt>
                  <dd className="rounded  px-2 py-0.5 font-mono text-xs text-on-surface">
                    {formatPrice(order.order.discountAmount)}
                  </dd>
                </div>
                </div>
                
              )}
              <div className="border-t border-outline-variant/30 pt-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-semibold text-on-surface">Total</dt>
                  <dd className="text-lg font-semibold text-on-surface">
                    {formatPrice(order.order.totalPrice)}
                  </dd>
                </div>
              </div>
            </dl>
          </Card>

        <Card title="Payment" icon={CreditCard}>
  <p className="text-sm capitalize text-on-surface">
    {String(order.order.paymentMethod).replace(/[_-]/g, " ")}
  </p>

  <p className="mt-1 text-xs text-on-surface-variant">
    {paymentStyle.label}
  </p>

  {order.payment && order.order.paymentStatus.toLowerCase() === "pending" && (
    <div className="mt-4 border-t border-outline-variant/30 pt-4">
      <p className="mb-3 text-xs text-on-surface-variant">
        Your payment is still pending. You can view your payment details
        and retrieve your Fawry reference number or QR code.
      </p>

      <Link
        href={`/payment/details/${order.payment.id}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        View Payment Details
      </Link>

      {order.payment.expireDate && (
        <p className="mt-2 text-xs text-on-surface-variant">
          Expires at:{" "}
          {formatPublishedDate(order.payment.expireDate)}
        </p>
      )}
    </div>
  )}
</Card>

          
        </div>
      </div>
    </main>
  );
}