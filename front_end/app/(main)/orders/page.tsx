import { getOrdersApi } from "@/features/orders/api/getOrders";
import OrdersList from "@/features/orders/components/OrdersList";

export default async function OrdersPage() {
  const { data: orders } = await getOrdersApi();

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-on-surface">
          My Library Shipments
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Track your arriving books and view past orders.
        </p>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
