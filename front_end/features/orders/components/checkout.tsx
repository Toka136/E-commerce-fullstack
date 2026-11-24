"use client";

import { JSX, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFormik } from "formik";
import { useGetCart } from "@/features/cart/hooks/useGetCart";
import PaymentMethodSelector from "@/features/orders/components/paymentSelector";
import { shippingInitialValues, shippingValidationSchema } from "@/features/orders/utils/Shippingform.schema";
import { ShippingFormValues } from "../types/orders";
import { Address } from "@/features/profile/types/address";
import SavedAddressesSection from "@/features/orders/components/savedAddressesSection";
import ShippingDetailsForm from "@/features/orders/components/shippingDetailsForm";
import OrderSummary from "@/features/orders/components/orderSummary";
import { PaymentMethod } from "../types/orders";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { ErrorFormate } from "@/features/cart/utils/errorFormate";
import {  CartResponse } from "@/features/cart/types/cart";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/cart-store";
import OnlinePaymentMethodSelector from "./onlinePaymentSelector";
import { useGetOPaymentMethods } from "../hooks/useGetOPaymentMethods";

type Props = {
  cart: CartResponse["data"];
  addresses: Address[];
};
export default function Checkout({addresses,cart}:Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [onlinePaymentMethod,setOnlinePaymentMethod]=useState<number>(0)
  const {mutateAsync:createOrder,isPending:createOrderPending}=useCreateOrder()
  const {data:onlinePaymentMethods,isLoading,error}=useGetOPaymentMethods()
  const router=useRouter()
  const {setCount}=useCartStore()
  const idempotencyKey = useRef<string | null>(null);
  const handleCreateOrder = async () => {
    if (!idempotencyKey.current) {
    idempotencyKey.current = crypto.randomUUID();
  }
    try{
        console.log("onlinePaymentMethod",onlinePaymentMethod);

      await createOrder({data:{address:formik.values,paymentMethod},idempotencyKey:idempotencyKey.current})
      router.refresh()
      setCount(0)
       idempotencyKey.current = null;
    }catch (err) {
      const message = ErrorFormate({ error: err });
      setErrorMessage(message);
    }
    
  }
  const formik = useFormik<ShippingFormValues>({
    initialValues: shippingInitialValues,
    validationSchema: shippingValidationSchema,
    onSubmit:handleCreateOrder,
  });

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    formik.setValues({
      ...formik.values,
      mobile: address.mobile,
      country: address.country,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2??"",
    });
  };
    if (cart?.items.length===0) {
      console.log("cartlength",cart.items.length)
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p className="text-2xl">You have no books in your cart</p>
          <Link href="/books">Explore books</Link>
        </div>
      );
    }

  return (
    <>
    
    
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto flex w-full md:w-[90%] flex-col gap-8 px-4 py-6">
     

        <div className="text-center">
          <h2 className="text-xl font-bold text-on-surface">
            Complete Your Order
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Just a few more details to get your books on their way.
          </p>
        </div>
       <div className="flex flex-col md:flex-row gap-4">
        <div  className="w-full md:w-[60%] h-fit">
        <ShippingDetailsForm formik={formik} />
        <div className="flex flex-col md:flex-row ">

        {cart && (
          <div  className="w-full ">
            <OrderSummary items={cart.items} discountAmount={cart.discountAmount??0} subtotal={cart.subtotal} totalPrice={(cart.coupon?.code?cart.totalAfterCoupon:cart.subtotal)??0} couponCode={cart.coupon?.code} />
          </div>
        )}
        </div>

        </div>
        <div  className="w-full md:w-[40%] ">
            <div className="mb-8">
        <SavedAddressesSection
          selectedAddressId={selectedAddressId}
          onSelect={handleSelectAddress}
          addresses={addresses}
        />
        </div>
        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        {paymentMethod === "online" && (
          <OnlinePaymentMethodSelector
            value={onlinePaymentMethod}
            onChange={setOnlinePaymentMethod}
              loading={isLoading}
            options={onlinePaymentMethods?.data.data??[]}
            error={error?.message}
          />
        )}
        </div>
        
       </div>

       
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-outline-variant/40 bg-surface-container-lowest p-4">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={!cart || cart.items.length === 0||createOrderPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {paymentMethod==="cod"?"Place Order":"Continue to Payment"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {errorMessage && (
          <p className="text-red-500">{errorMessage}</p>
        )}
        </div>
      </div>
    </div>
    </>
  );
}