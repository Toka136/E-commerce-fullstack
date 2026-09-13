import Link from "next/link"
import { Eye } from "lucide-react"

import OrderStatusSelect from "./OrderStatusSelect"
import { Order } from "@/features/orders/types/orders"
import { formatOrderDate, getOrderNumber } from "@/features/orders/utils/format"

export const AdminOrdersTable = ({ orders }: { orders: Order[] }) => {
    return (
        <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-scroll">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low/50">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                            Order
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                            Items
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                            Total
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                            Payment
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                            Status
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                    {orders.map((order) => (
                        <tr
                            key={order._id}
                            className="hover:bg-surface-container-low/30 transition-colors group"
                        >
                            <td className="px-6 py-4">
                                <p className="text-[#0b1c30] leading-tight font-medium">
                                    Order #{getOrderNumber(order._id)}
                                </p>
                                <p className="text-sm text-on-surface-variant">
                                    {formatOrderDate(order.createdAt)}
                                </p>
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "item" : "items"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#0b1c30]">
                                ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                <span className="uppercase">{order.paymentMethod}</span>
                                <span className="mx-1">·</span>
                                <span className="capitalize">{order.paymentStatus}</span>
                            </td>
                            <td className="px-6 py-4">
                                <OrderStatusSelect orderId={order._id} status={order.orderStatus} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    title="View Details"
                                    className="inline-flex p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                                >
                                    <Eye className="w-5 h-5" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20">
                <p className="text-sm text-on-surface-variant">
                    Showing {orders.length} of {orders.length} orders
                </p>
            </div>
        </div>
    )
}
