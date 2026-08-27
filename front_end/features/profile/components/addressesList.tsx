"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AddressCard from "./addressCard";
import AddAddressModal from "./addAddressModal";
import { Address } from "../types/address";
import EditAddressModal from "./editAddressModal";
import { useSetAsDefault } from "../hooks/useSetAsDefault";
import { AxiosError } from "axios";
import { CircularProgress } from "@mui/material";
import { useDeleteAddress } from "../hooks/useDeleteAddress";
import DeleteAddressModal from "./deleteAddressModal";

export default function AddressList({ addresses }: { addresses: Address[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const {mutateAsync:setAsDefault,isPending}=useSetAsDefault()
  const {mutateAsync:deleteAddress,isPending:deletePending}=useDeleteAddress()
  
  const handleEdit=(address:Address,edit:boolean) => {
    setIsEditOpen(edit);
    setSelectedAddress(address);

  }
  const handleDeleteOpen=(addressId:string) => {
    setIsDeleteOpen(true);
    setSelectedAddressId(addressId);

  }
  const handleSetDefault=async(addressId:string)=>{
    try{
        await setAsDefault(addressId)
    }
     catch(err){
          const error = err as AxiosError;
          const message =
            (error.response?.data as { message?: string })?.message ??
            "Failed to update profile. Please try again.";
          if (err instanceof AxiosError) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("MESSAGE:", err.response?.data?.message);
        }
        }
  }
  const handleDelete=async(addressId:string)=>{
    try{
      console.log("addressId",addressId);
        await deleteAddress(addressId)
    }
     catch(err){
          const error = err as AxiosError;
          const message =
            (error.response?.data as { message?: string })?.message ??
            "Failed to update profile. Please try again.";
          if (err instanceof AxiosError) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("MESSAGE:", err.response?.data?.message);
        }
        }
  }
  return (
    <>
    {(isPending||deletePending) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <CircularProgress color="inherit" />
      </div>}
    <div className="flex flex-col gap-4">
        {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={handleEdit}
          onSetDefault={handleSetDefault}
          onDelete={handleDeleteOpen}
        />
      ))}

      <button
        type="button"
        onClick={() => setIsAddOpen(true)}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant py-10 text-on-surface-variant transition hover:bg-surface-container-low"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary">
          <Plus className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium">Add New Address</span>
      </button>

      <AddAddressModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
      {selectedAddress && (
         <EditAddressModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        address={selectedAddress}
      />
      
      )}
      <DeleteAddressModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        addressId={selectedAddressId || ""}
        onDelete={handleDelete}
      />
     
    </div>
    </>
  );
}