"use client";

import { Address } from "@/features/profile/types/address";
import { MapPin } from "lucide-react";

interface SavedAddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: (address: Address) => void;
}

export default function SavedAddressCard({
  address,
  selected,
  onSelect,
}: SavedAddressCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(address)}
      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
        selected
          ? "border-primary bg-surface-container-low"
          : "border-transparent bg-surface-container-low hover:border-outline-variant"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected
            ? "border-primary bg-primary"
            : "border-outline-variant bg-transparent"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-on-primary" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-on-surface-variant" />
          <p className="text-sm font-medium text-on-surface">
            {address.title}
          </p>
          {address.isDefault && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-primary">
              Default
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-on-surface-variant">
          {address.addressLine1}, {address.city}, {address.country}
        </p>
      </div>
    </button>
  );
}