import Link from "next/link";
import { Check, ShoppingBag, PackageSearch } from "lucide-react";

interface OrderSuccessProps {
  orderId: string;
  continueShoppingHref?: string;
  trackOrderHref?: string;
}

export default function OrderSuccess({
  orderId,
  continueShoppingHref = "/books",
  trackOrderHref = "/profile/orders",
}: OrderSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-low px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
      </span>

      <div>
        <h1 className="text-base font-semibold text-on-surface">
          Order Created Successfully!
        </h1>
        <p className="mt-1 text-xs text-on-surface-variant">
          Your order #{orderId} has been placed.
        </p>
      </div>

      <div className="mt-2 flex w-full max-w-xs flex-col gap-2.5">
        <Link
          href={continueShoppingHref}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Link>

        <Link
          href={trackOrderHref}
          className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
        >
          <PackageSearch className="h-4 w-4" />
          Track Your Order
        </Link>
      </div>
    </div>
  );
}