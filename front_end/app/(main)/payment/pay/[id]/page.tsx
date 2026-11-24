import { PayOrder } from "@/features/orders/components/payOrder";

type Props = {
  params: Promise<{ id: string,paymentMethod: number }>;
};

export default async function Page({ params }: Props) {
  const  {id,paymentMethod}  = await params;
  

  return <PayOrder id={id} paymentMethod={paymentMethod} />;
}