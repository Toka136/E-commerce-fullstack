import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "../api/changeOrderStatus";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/features/orders/types/orders";

export const UseChangeOrderStatus = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      changeOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Order status updated successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to update order status")
    }
  })
}
