"use client";

import { ErrorFormate } from "@/features/cart/utils/errorFormate";
import { usePayOrder } from "@/features/orders/hooks/usePayOrder";
import PaymentStatusCard from "@/features/payment/components/PaymentStatusCard";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  paymentMethod: number;
};

export const PayOrder = ({ id ,paymentMethod}: Props) => {
  const { mutateAsync: payOrder, isPending: isPaying } = usePayOrder();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;

    const handlePayOrder = async () => {
      try {

        await payOrder({
          id,
          onlinePaymentMethod:paymentMethod??3,
        });
      } catch (err) {
        const message = ErrorFormate({ error: err });
        setErrorMessage(message);
      } finally {
      }
    };

    handlePayOrder();
  }, [id, payOrder]);

  return (
    <div className="mx-auto max-w-xl p-6">
      {errorMessage ? (
        <PaymentStatusCard
          tone="failed"
          icon={AlertCircle}
          title="Unable to initiate payment"
          description={errorMessage}
        />
      ) : (
        <PaymentStatusCard
          tone="success"
          icon={Loader2}
          title="Order created successfully!"
          description="Please wait while we redirect you to the payment page to complete your purchase."
        />
      )}

      {isPaying && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Redirecting you to the payment page...
        </p>
      )}

      {errorMessage && (
        <button
          onClick={() => {
            setErrorMessage(null);
        window.location.reload()}}
          className="mt-4 w-full rounded-lg bg-primary p-3 text-white"
        >
          Try Again
        </button>
      )}
    </div>
  );
};