"use client";

import { Drawer, IconButton, Divider, Button } from "@mui/material";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { CartDrawerProps } from "../types/cart";
import SideCartItem from "./sideCartItem";
import { useCartStore } from "../store/cart-store";
import { useGetCart } from "../hooks/useGetCart";



// export const currency = (value: number) =>
//   value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function SideCart({
  onCheckout,
  shippingEstimate = 5.0,
}: CartDrawerProps) {
  const {data,isPending,error}=useGetCart()
  const {isOpen,onClose,}=useCartStore()
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          className: "w-full max-w-[380px] flex flex-col",
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
        <IconButton onClick={onClose} size="small" aria-label="Close cart">
          <X size={20} className="text-gray-500" />
        </IconButton>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {data?.data.items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-8">Your cart is empty.</p>
        ) : (
          data?.data.items.map((item) => (
            <div key={item.product._id}>
          <SideCartItem  item= {{
              id:item.product._id,
              title:item.product.title,
              coverImage:item.product.coverImage,
              quantity:item.quantity,
              priceAtPurchase:item.product.price}
          } />
          </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-200 bg-[#EFF4FF]">
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-sm text-[#5E616C]">
            <span>Subtotal</span>
            <span>{(data?.data.subtotal)}$</span>
          </div>
          <div className="flex justify-between text-sm text-[#5E616C] mt-4">
            <span>Shipping (Estimated)</span>
            <span>{(data?.data.items.length ? shippingEstimate : 0)}</span>
          </div>
          <Divider className="my-2!" />
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{(data?.data.subtotal??0+shippingEstimate)}$</span>
          </div>
        </div>

        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={onCheckout}
          disabled={data?.data.items.length === 0}
          className="bg-[#3455B9] hover:bg-blue-700 normal-case py-3! rounded-lg text-sm font-semibold"
        >
          Proceed to Checkout
        </Button>
      </div>
    </Drawer>
  );
}

