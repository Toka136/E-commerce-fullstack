"use client";

import { CreditCard, CheckCircle2 } from "lucide-react";
import { onlinePaymentMethod } from "../types/orders";
import Image from "next/image";
import { LoaderC } from "@/UI/components/Loader";
import { ErrorFormate } from "@/features/cart/utils/errorFormate";
type  PaymentMethodSelectorProps = {
    value: number;
    onChange: (method: number) => void;
    options: onlinePaymentMethod[];
    loading:boolean,
    error?:string
}
export default function OnlinePaymentMethodSelector({
  value,
  onChange,
  options,
  loading,
  error
}: PaymentMethodSelectorProps) {
    console.log("options",options)
    if(loading)
        return(
            <LoaderC/>
        )
        if(error)
        {
            const err=ErrorFormate({error})
            return(
                <p className="text-red-500">{err}</p>
            )
        }
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Payment Method
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const selected = value === option.payment_method_id;

          return (
            <button
              key={option.payment_method_id}
              type="button"
              onClick={() => onChange(option.payment_method_id)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                selected
                  ? "border-primary bg-surface-container-low"
                  : "border-transparent bg-surface-container-low hover:border-outline-variant"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected
                    ? "border-primary bg-primary"
                    : "border-outline-variant bg-transparent"
                }`}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-on-primary" />
                )}
              </span>

              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">
                  {option.name_en}
                </p>

                <p className="text-xs text-on-surface-variant">
                  {option.name_ar}
                </p>
              </div>

              <Image
              width={14}
              height={14}
                src={option.logo}
                alt={option.name_en}
                className="h-8 w-auto max-w-16 shrink-0 object-contain"
              />

              {selected && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
