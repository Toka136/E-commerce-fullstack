"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import { UseChangeOrderStatus } from "../hooks/useChangeOrderStatus";
import { OrderStatus } from "@/features/orders/types/orders";
import {
  ALL_ORDER_STATUSES,
  ORDER_STATUS_CONFIG,
} from "../types/orderStatus";
import { CancellOrder } from "./cancellOrder";
import { UseCancelOrder } from "../hooks/useCancelOrder";
import { useRouter } from "next/navigation";

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const { mutate: changeStatus, isPending } = UseChangeOrderStatus();
  const { mutate: cancelOrder, isPending: isCancelPending } = UseCancelOrder();
   const router = useRouter();

  const [value, setValue] = useState(status);
  const [openDialog, setOpenDialog] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(status);

  const isDisabled =
   isCancelPending|| isPending || status === "cancelled" || status === "delivered";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;

    if (newStatus === "cancelled") {
      setPreviousStatus(value);
      setOpenDialog(true);
      return;
    }

    updateStatus(newStatus);
  };

  const updateStatus = (newStatus: OrderStatus) => {
    const previous = value;

    setValue(newStatus);

    changeStatus(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => {router.refresh();setValue(newStatus)},
        onError: () => setValue(previous),
      }
    );
  };
 const handleCancelOrder = () => {
  cancelOrder(
    { id: orderId },
    {
      onSuccess: () => {
        setValue("cancelled");
        router.refresh();
      },
      onError: () => {
        setValue(previousStatus);
      },
    }
  );
};

  const handleCancelConfirmation = () => {
    setOpenDialog(false);
    setValue(previousStatus);
  };

  const handleConfirmCancellation = () => {
    setOpenDialog(false);
   handleCancelOrder()
  };

  const config = ORDER_STATUS_CONFIG[value];

  return (
    <>
      <select
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        className={`rounded-full border-none px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
      >
        {ALL_ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>

     <CancellOrder openDialog={openDialog} handleCancelConfirmation={handleCancelConfirmation} handleConfirmCancellation={handleConfirmCancellation} />
    </>
  );
}
