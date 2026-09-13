import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { getOrder } from "@/features/ordersManagment/api/getOrder"
import { formatOrderDate, getItemImageUrl, getOrderNumber } from "@/features/orders/utils/format"
import OrderStatusSelect from "@/features/ordersManagment/components/OrderStatusSelect"
import Image from "next/image"

interface AdminOrderDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({
    params,
}: AdminOrderDetailPageProps) {
    const { id } = await params
    const { data: order } = await getOrder(id)

    return (
        <div className="mx-auto w-full md:w-[80%]  space-y-6 p-8">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/orders"
                    className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-on-surface">
                        Order #{getOrderNumber(order._id)}
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                        {formatOrderDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                <span className="text-sm font-semibold text-on-surface-variant">
                    Order Status
                </span>
                <OrderStatusSelect orderId={order._id} status={order.orderStatus} />
            </div>

            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                <h2 className="font-semibold text-on-surface">Items</h2>
                <div className="divide-y divide-outline-variant/10">
                    {order.items.map((item) => {
                        const imageUrl = getItemImageUrl(item.imageAtPurchase)
                        return (
                            <div key={item._id} className="flex items-center gap-4 py-3">
                                {imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <Image
                                        src={imageUrl}
                                        alt={item.titleAtPurchase}
                                        className="h-16 w-12 shrink-0 rounded-md border border-outline-variant/30 object-cover"
                                        width={48}
                                        height={64}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-on-surface">
                                        {item.titleAtPurchase}
                                    </p>
                                    <p className="text-sm text-on-surface-variant">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <span className="font-semibold text-on-surface">
                                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-between border-t border-outline-variant/20 pt-4">
                    <span className="font-semibold text-on-surface">Total</span>
                    <span className="text-lg font-bold text-primary">
                        ${order.totalPrice.toFixed(2)}
                    </span>
                </div>
            </div>
          <div className="flex flex-col gap-6 md:flex-row items-stretch justify-between w-full">
    <div className="border border-b-on-primary-fixed-variant space-y-1 w-full md:w-[45%] rounded-2xl bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h2 className="mb-2 font-semibold text-on-surface">Shipping Address</h2>
        <p className="text-sm text-on-surface-variant">
            {order.shippingAddress.addressLine1}
        </p>
        <p className="text-sm text-on-surface-variant">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
        </p>
        <p className="text-sm text-on-surface-variant">
            {order.shippingAddress.country}
        </p>
        <p className="text-sm text-on-surface-variant">
            {order.shippingAddress.mobile}
        </p>
    </div>

    <div className="border border-b-on-primary-fixed-variant space-y-1 w-full md:w-[45%] rounded-2xl bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h2 className="mb-2 font-semibold text-on-surface">Payment</h2>
        <p className="text-sm text-on-surface-variant">
            Method: <span className="uppercase">{order.paymentMethod}</span>
        </p>
        <p className="text-sm text-on-surface-variant">
            Status: <span className="capitalize">{order.paymentStatus}</span>
        </p>
    </div>
</div>
        </div>
    )
}