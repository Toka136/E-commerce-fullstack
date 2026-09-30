import { getOrders } from "@/features/ordersManagment/api/getOrders"
import { AdminOrdersTable } from "@/features/ordersManagment/components/AdminOrdersTable"


export default async function AdminOrdersPage() {
    const { data: orders } = await getOrders()

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-on-surface">Orders</h1>
                <p className="text-sm text-on-surface-variant">
                    Manage customer orders and update shipment status
                </p>
            </div>

            <AdminOrdersTable orders={orders} />
        </div>
    )
}