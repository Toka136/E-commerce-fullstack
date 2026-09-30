"use client";

import { CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { PaymentMethod, PaymentMethodSelectorProps } from "../types/orders";



const OPTIONS: {
  value: PaymentMethod;
  title: string;
  subtitle: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: "online",
    title: "Online Payment",
    subtitle: "Visa, Mastercard, Amex",
    icon: CreditCard,
  },
  {
    value: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when you receive it",
    icon: Banknote,
  },
];

export default function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Payment Method
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ value: optionValue, title, subtitle, icon: Icon }) => {
          const selected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
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
                <p className="text-sm font-medium text-on-surface">{title}</p>
                <p className="text-xs text-on-surface-variant">{subtitle}</p>
              </div>

              {selected ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Icon className="h-4 w-4 shrink-0 text-on-surface-variant" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}