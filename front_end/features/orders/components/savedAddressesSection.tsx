
"use client";
import { Plus } from "lucide-react";
import { Address, AddressListResponse } from "@/features/profile/types/address";
import SavedAddressCard from "./savedAddressCard";
import { getAddressesApi } from "@/features/profile/api/getAddresses";
interface SavedAddressesSectionProps {
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
  addresses: Address[]
}
export default  function SavedAddressesSection({
  selectedAddressId,
  onSelect,
  addresses
}: SavedAddressesSectionProps) {
 

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-on-surface">
          Saved Addresses
        </h2>
     
      </div>
{/* 
      {isPending && (
        <p className="text-sm text-on-surface-variant">Loading addresses…</p>
      )}

      {error && (
        <p className="text-sm text-error">Couldn't load your addresses.</p>
      )}

      {!isPending && !error && addresses.length === 0 && (
        <p className="text-sm text-on-surface-variant">
          No saved addresses yet — add one or fill the form below.
        </p>
      )} */}

      <div className="flex flex-col gap-3">
        {addresses.map((address) => (
          <SavedAddressCard
            key={address._id}
            address={address}
            selected={address._id === selectedAddressId}
            onSelect={onSelect}
          />
        ))}
      </div>

    
    </section>
  );
}