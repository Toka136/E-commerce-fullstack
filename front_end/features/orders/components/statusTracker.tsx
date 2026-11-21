import { Check, XCircle } from "lucide-react";
import { OrderStatus } from "../types/orders";

const TRACK_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];
export function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
        <XCircle className="h-5 w-5 shrink-0" />
        This order was cancelled.
      </div>
    );
  }

  const current = TRACK_STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="flex w-full items-start">
      {TRACK_STEPS.map((step, i) => {
        const done = i <= current;
        const isLast = i === TRACK_STEPS.length - 1;
        return (
          <li key={step.key} className="relative flex flex-1 flex-col items-center">
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${
                  i < current ? "bg-primary" : "bg-outline-variant/40"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                done
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant/60 bg-surface text-on-surface-variant"
              }`}
              aria-current={i === current ? "step" : undefined}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={`mt-2 text-center text-xs ${
                done ? "font-medium text-on-surface" : "text-on-surface-variant"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}