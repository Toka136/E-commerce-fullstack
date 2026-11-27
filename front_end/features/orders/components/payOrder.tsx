"use client";

import { ErrorFormate } from "@/features/cart/utils/errorFormate";
import { usePayOrder } from "@/features/orders/hooks/usePayOrder";
import PaymentStatusCard from "@/features/payment/components/PaymentStatusCard";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import OnlinePaymentMethodSelector from "./onlinePaymentSelector";
import { useGetOPaymentMethods } from "../hooks/useGetOPaymentMethods";

type Props = {
  id: string;
};

export const PayOrder = ({ id }: Props) => {
  const { mutateAsync: payOrder, isPending: isPaying } = usePayOrder();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [onlinePaymentMethod,setOnlinePaymentMethod]=useState<number>(2)
    const {data:onlinePaymentMethods,isLoading,error}=useGetOPaymentMethods()
  const started = useRef(false);



    const handlePayOrder = async () => {
      try {

        await payOrder({
          id,
          onlinePaymentMethod:onlinePaymentMethod??2,
        });
      } catch (err) {
        const message = ErrorFormate({ error: err });
        setErrorMessage(message);
      } finally {
      }
    };



  return (
    <div className="mx-auto  flex flex-col items-center gap-4 rounded-2xl bg-surface-container-low px-6 py-10 text-center">
      <div className=" w-full md:w-[70%]">
      {errorMessage ? (
        <PaymentStatusCard
          tone="failed"
          icon={AlertCircle}
          title="Unable to initiate payment"
          description={errorMessage}
        />
      ) : (
        <div className="bg-surface-container-low">
        <PaymentStatusCard
          tone="success"
          icon={Loader2}
          title="Order created successfully!"
          description="Please select a payment method."
        />
         <OnlinePaymentMethodSelector
            value={onlinePaymentMethod}
            onChange={setOnlinePaymentMethod}
              loading={isLoading}
            options={onlinePaymentMethods?.data.data??[]}
            error={error?.message}
          />
          <button disabled={isPaying} onClick={()=>handlePayOrder()} className="mt-4 w-full rounded-lg bg-primary p-3 text-white"> pay Now</button>
          </div>
        
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
    </div>

  );
};