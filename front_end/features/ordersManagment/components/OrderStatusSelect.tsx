"use client"

import { useState } from "react"

import { UseChangeOrderStatus } from "../hooks/useChangeOrderStatus"
import { OrderStatus } from "@/features/orders/types/orders"
import { ALL_ORDER_STATUSES, ORDER_STATUS_CONFIG } from "../types/orderStatus"

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string
  status: OrderStatus
}) {
  const { mutate: changeStatus, isPending } = UseChangeOrderStatus()
  const [value, setValue] = useState(status)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus
    const previous = value
    setValue(newStatus)
    changeStatus(
      { id: orderId, status: newStatus },
      { onError: () => setValue(previous) }
    )
  }

  const config = ORDER_STATUS_CONFIG[value]

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-full border-none px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 ${config.className}`}
    >
      {ALL_ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_CONFIG[s].label}
        </option>
      ))}
    </select>
  )
}
