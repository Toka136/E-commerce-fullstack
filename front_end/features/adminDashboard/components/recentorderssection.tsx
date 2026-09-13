import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Order } from "@/features/orders/types/orders"
import { getOrderNumber } from "@/features/orders/utils/format"
import OrderStatusBadge from "@/features/orders/components/ordersStatusBadge"


export default function RecentOrdersSection({ orders }: { orders: Order[] }) {
    const recentOrders = orders.slice(0, 5)

    return (
        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-on-surface">Recent Orders</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        Live fulfillment state dispatching directly to warehouse log
                    </p>
                </div>
                <Link
                    href="/admin/orders"
                    className="flex flex-shrink-0 items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
                >
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {recentOrders.length === 0 ? (
                <p className="mt-6 text-sm text-on-surface-variant">No orders yet.</p>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left">
                        <thead>
                            <tr className="border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                <th className="py-2 pr-4">Order ID</th>
                                <th className="py-2 pr-4">Book Titles</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className="py-3 pr-4">
                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {getOrderNumber(order._id)}
                                        </Link>
                                    </td>
                                    <td className="max-w-[220px] truncate py-3 pr-4 text-sm text-on-surface-variant">
                                        {order.items.map((item) => item.titleAtPurchase).join(", ")}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <OrderStatusBadge status={order.orderStatus} />
                                    </td>
                                    <td className="py-3 text-right text-sm font-semibold text-on-surface">
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}