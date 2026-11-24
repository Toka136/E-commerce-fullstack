import PaymentStatusCard from "@/features/payment/components/PaymentStatusCard";
import { XCircle } from "lucide-react";

type SearchParams = Promise<{ orderId?: string; reason?: string }>;

export const metadata = { title: "Payment failed | LibroDiscovery" };

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId, reason } = await searchParams;

  const details = [
    ...(orderId ? [{ label: "Order ID", value: orderId }] : []),
    ...(reason ? [{ label: "Reason", value: reason }] : []),
  ];

  return (
    <PaymentStatusCard
      tone="failed"
      icon={XCircle}
      title="Payment failed"
      description="We couldn't complete your payment and you haven't been charged. Check your card details or try another payment method."
      details={details}
      actions={[
        { label: "Try again", href: "/cart", primary: true },
        { label: "Back to store", href: "/store" },
      ]}
    />
  );
}