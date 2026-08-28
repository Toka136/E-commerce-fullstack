"use client";

import { useMemo, useState } from "react";

import OrderFilterTabs, { OrderFilter } from "./OrderFilterTabs";
import OrderCard from "./OrderCard";
import { Order } from "../types/orders";
import { isActiveStatus } from "../utils/orderStatus";

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderFilter>("all");

  const filteredOrders = useMemo(() => {
    if (filter === "active") {
      return orders.filter((order) => isActiveStatus(order.orderStatus));
    }
    if (filter === "delivered") {
      return orders.filter((order) => order.orderStatus === "delivered");
    }
    return orders;
  }, [orders, filter]);

  return (
    <div className="flex flex-col gap-5">
      <OrderFilterTabs value={filter} onChange={setFilter} />

      {filteredOrders.length === 0 ? (
        <p className="py-10 text-center text-sm text-on-surface-variant">
          No orders here yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
