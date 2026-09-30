"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Phone } from "lucide-react";
import { Address } from "../types/address";


interface AddressCardProps {
  address: Address;
  onSetDefault: (addressId: string) => void;
  onEdit?: (address: Address,edit:boolean) => void;
  onDelete?: (addressId: string) => void;
}

export default function AddressCard({ address, onSetDefault, onEdit, onDelete }: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
 console.log("address edit",address);

  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-on-surface">
            {address.title}
          </h3>
          {address.isDefault && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-primary">
              Default
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Edit address"
            onClick={() => onEdit?.(address,true)}
            className="text-primary hover:opacity-80"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Delete address"
            onClick={()=>onDelete?.(address._id)}
            disabled={isPending}
            className="text-error hover:opacity-80 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-0.5 text-sm text-on-surface-variant">
        <p>{address.addressLine1}</p>
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm text-on-surface-variant">
        <Phone className="h-3.5 w-3.5" />
        {address.mobile}
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={()=>onSetDefault(address._id)}
          disabled={isPending}
          className="mt-3 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
        >
          Set as default
        </button>
      )}

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}