import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cancelOrder } from "../api/cancelOrder";

export const UseCancelOrder = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ id, }: { id: string;}) =>
      cancelOrder(id),
    onSuccess: () => {
      toast.success("Order  canceled successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to cancel order status")
    }
  })
}
