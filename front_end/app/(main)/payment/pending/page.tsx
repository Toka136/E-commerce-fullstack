import PaymentStatusCard from "@/features/payment/components/PaymentStatusCard";
import RefreshStatusButton from "@/features/payment/components/RefreshStatusButton";
import { Clock } from "lucide-react";


type SearchParams = Promise<{ orderId?: string }>;

export const metadata = { title: "Payment pending | LibroDiscovery" };

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId } = await searchParams;

  // TODO: fetch the real order status by orderId here, then
  // redirect("/payment/success") or redirect("/payment/failed") when it changes.

  return (
    <PaymentStatusCard
      tone="pending"
      icon={Clock}
      title="Payment pending"
      description="We're waiting for confirmation from your bank. This usually takes a few minutes. You can leave this page and we'll update your order."
      details={orderId ? [{ label: "Order ID", value: orderId }] : undefined}
      actions={[
        { label: "View my orders", href: "/orders", primary: true },
        { label: "Back to store", href: "/store" },
      ]}
    >
      <RefreshStatusButton />
    </PaymentStatusCard>
  );
}