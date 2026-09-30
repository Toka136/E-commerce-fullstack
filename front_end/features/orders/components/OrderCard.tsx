import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import OrderItemThumbnails from "./OrderItemThumbnails";
import { Order } from "../types/orders";
import { formatOrderDate, getOrderNumber } from "../utils/format";
import OrderStatusBadge from "./ordersStatusBadge";

export default function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.length;
  const isDelivered = order.orderStatus === "delivered";

  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-on-surface">
            Order #{getOrderNumber(order._id)}
          </p>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            {formatOrderDate(order.createdAt)} • {itemCount}{" "}
            {itemCount === 1 ? "Item" : "Items"}
          </p>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-4">
        <OrderItemThumbnails items={order.items} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-on-surface">
          ${order.totalPrice.toFixed(2)}
        </span>

        <div className="flex items-center gap-4">
          {!isDelivered&&   (
            <>
              <Link
                href={`/orders/${order._id}`}
                className="text-sm font-medium text-primary hover:opacity-80"
              >
                Details
              </Link>
              <Link
                href={`/orders/${order._id}/track`}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:opacity-90"
              >
                Track
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
