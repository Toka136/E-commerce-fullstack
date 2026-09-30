import OrderSuccess from "@/features/orders/components/orderSuccess";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({searchParams}: OrderSuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <OrderSuccess orderId={orderId ?? "—"} />
      </div>
    </div>
  );
}