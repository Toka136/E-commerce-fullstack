import { getCartServer } from "@/features/cart/api/getCartServer";
import Checkout from "@/features/orders/components/checkout";
import { getAddressesApi } from "@/features/profile/api/getAddresses";

export default async function CheckoutPage() {
  const [cartResult, addressesResult] = await Promise.allSettled([
    getCartServer(),
    getAddressesApi(),
  ]);
   console.log("cartResult",cartResult)
  if (cartResult.status === "rejected") {
    throw new Error("Failed to load checkout data");
  }

  if (addressesResult.status === "rejected") {
    throw new Error("Failed to load addresses");
  }

  const cartData = cartResult.value.data;
  const addresses = addressesResult.value.data;

  return (
    <Checkout
      cart={cartData}
      addresses={addresses}
    />
  );
}