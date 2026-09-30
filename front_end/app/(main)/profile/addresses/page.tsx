import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAddressesApi } from "@/features/profile/api/getAddresses";
import AddressList from "@/features/profile/components/addressesList";


export default async function ShippingAddressesPage() {
  const { data: addresses } = await getAddressesApi();

  return (
    <div className="mx-auto flex w-full md:w-[80%] flex-col gap-4 px-4 py-6">
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold text-on-surface">
          Shipping Addresses
        </h1>
      </div>

      <AddressList addresses={addresses} />
    </div>
  );
}