import { useMutation } from "@tanstack/react-query"
import { payOrder } from "../api/payOrder"
import { useRouter } from "next/navigation";

export const usePayOrder = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      onlinePaymentMethod,
    }: {
      id: string;
      onlinePaymentMethod: number;
    }) => payOrder(id, onlinePaymentMethod),

    onSuccess: (response) => {
      const payment = response.data;
      console.log("payment", payment);

      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        router.push(`/payment/details/${payment.id}`);
      }
    },
  });
};