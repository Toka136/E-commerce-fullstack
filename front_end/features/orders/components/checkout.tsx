"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFormik } from "formik";
// Adjust this import to wherever your cart hook actually lives.
import { useGetCart } from "@/features/cart/hooks/useGetCart";
import PaymentMethodSelector from "@/features/orders/components/paymentSelector";
import { shippingInitialValues, shippingValidationSchema } from "@/features/orders/utils/Shippingform.schema";
import { ShippingFormValues } from "../types/orders";
import { Address } from "@/features/profile/types/address";
import SavedAddressesSection from "@/features/orders/components/savedAddressesSection";
import ShippingDetailsForm from "@/features/orders/components/shippingDetailsForm";
import CouponCode from "@/features/orders/components/couponCodes";
import OrderSummary from "@/features/orders/components/orderSummary";
import { PaymentMethod } from "../types/orders";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { AxiosError } from "axios";


export default function Checkout({addresses}:{addresses:Address[]}) {
  const { data, isPending, error } = useGetCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const {mutateAsync:createOrder,isPending:createOrderPending}=useCreateOrder()
  const handleCreateOrder = async () => {
    try{
      console.log("address",formik.values);
      await createOrder({address:formik.values,paymentMethod})
    }catch(err){
        const error = err as AxiosError;
        const message =
          (error.response?.data as { message?: string })?.message ??
          "Failed to update profile. Please try again.";
        if (err instanceof AxiosError) {
          console.log("STATUS:", err.response?.status);
          console.log("DATA:", err.response?.data);
          console.log("MESSAGE:", err.response?.data?.message);
      }
      setErrorMessage(message);
      }
  }
  const formik = useFormik<ShippingFormValues>({
    initialValues: shippingInitialValues,
    validationSchema: shippingValidationSchema,
    onSubmit:handleCreateOrder,
  });

  // Selecting a saved address fills whatever overlapping fields it has.
  // Saved addresses don't carry first/last name or email, so those are
  // left as the user typed them.
  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address._id);
    formik.setValues({
      ...formik.values,
      mobile: address.mobile,
      country: address.country,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
    });
  };

  const handleApplyCoupon = (code: string) => {
    // TODO: wire to your coupon-validation API.
    console.log("Applying coupon", code);
  };

  return (
    <>
    {data?.data.items.length===0&&
    <div className="flex flex-col justify-center items-center min-h-screen">
    <p className="text-2xl ">you have no books in your cart</p>
    <Link href={"/books"}  className="flex w-[320px] items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm mt-8 font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50">
    explore books
    </Link>
    </div>
    }
    {data?.data.items.length!==0&&
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
        <div  className="w-full md:w-[60%]">
        <ShippingDetailsForm formik={formik} />

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
        </div>
        
       </div>

       <div className="flex flex-col md:flex-row gap-4">
         <div className="w-full md:w-[40%]"><CouponCode onApply={handleApplyCoupon} /></div>

        {isPending && (
          <p className="text-sm text-on-surface-vahandleSelectAddressriant">Loading your cart…</p>
        )}
        {error && (
          <p className="text-sm text-error">Couldn't load your cart.</p>
        )}
        {data && (
          <div  className="w-full md:w-[60%]">
            <OrderSummary items={data.data.items} subtotal={data.data.subtotal} />
          </div>
        )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-outline-variant/40 bg-surface-container-lowest p-4">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={!data || data.data.items.length === 0||createOrderPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {paymentMethod==="cod"?"Place Order":"Continue to Payment"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {errorMessage && (
            <p className="mt-4 text-sm text-error">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>}
    </>
  );
}