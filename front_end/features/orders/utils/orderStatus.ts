import { Clock, Loader2, Truck, CheckCircle2, XCircle } from "lucide-react";
import { OrderStatus } from "../types/orders";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; icon: typeof Clock }> = {
   pending: {
    label: "Pending",
    className: "bg-surface-container text-on-surface-variant",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    className: "bg-surface-container text-on-surface-variant",
    icon: Loader2,
  },
  shipped: {
    label: "Shipped",
    className: "bg-primary/10 text-primary",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-primary/10 text-primary",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-error-container text-on-error-container",
    icon: XCircle,
  },
};

// Anything not yet delivered or cancelled counts as "Active" for the filter tab.
export function isActiveStatus(status: OrderStatus) {
  return status !== "delivered" && status !== "cancelled";
}