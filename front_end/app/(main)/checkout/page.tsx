import Checkout from "@/features/orders/components/checkout";
import { getAddressesApi } from "@/features/profile/api/getAddresses";

export default async function CheckoutPage() {
 const { data: addresses } = await getAddressesApi();

  return (
    <Checkout addresses={addresses} />
  );
}