import PaymentStatusCard from "@/features/payment/components/PaymentStatusCard";
import { CheckCircle2 } from "lucide-react";

type SearchParams = Promise<{ orderId?: string; amount?: string }>;

export const metadata = { title: "Payment successful | LibroDiscovery" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId, amount } = await searchParams;

  const details = [
    ...(orderId ? [{ label: "Order ID", value: orderId }] : []),
    ...(amount ? [{ label: "Amount paid", value: amount }] : []),
  ];

  return (
    <PaymentStatusCard
      tone="success"
      icon={CheckCircle2}
      title="Payment successful"
      description="Thank you for your purchase. Your books are ready in your orders."
      details={details}
      actions={[
        { label: "View my orders", href: "/orders", primary: true },
        { label: "Keep browsing", href: "/books" },
      ]}
    />
  );
}