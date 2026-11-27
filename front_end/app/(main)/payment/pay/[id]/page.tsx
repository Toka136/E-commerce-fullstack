import { PayOrder } from "@/features/orders/components/payOrder";

type Props = {
  params: Promise<{ id: string}>;
};

export default async function Page({ params }: Props) {
  const  {id}  = await params;
  

  return <PayOrder id={id}  />;
}