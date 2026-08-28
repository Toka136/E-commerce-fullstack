import { OrderStatus } from "../types/orders";
import { ORDER_STATUS_CONFIG } from "../utils/orderStatus";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`flex hrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}