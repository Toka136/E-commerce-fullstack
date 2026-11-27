"use client";

import { Drawer, IconButton, Divider, Button, CircularProgress } from "@mui/material";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { CartDrawerProps } from "../types/cart";
import SideCartItem from "./sideCartItem";
import { useCartStore } from "../store/cart-store";
import { useGetCart } from "../hooks/useGetCart";
import { useEffect } from "react";
import Link from "next/link";



// export const currency = (value: number) =>
//   value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function SideCart({
  onCheckout,
  shippingEstimate = 50.0,
}: CartDrawerProps) {
  const {data,isPending,error}=useGetCart()
  const cart = data?.data;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const {isOpen,onClose,}=useCartStore()
  const {setCount}=useCartStore()
  useEffect(() => {
  setCount(items.length);
}, [items.length, setCount]);
  console.log("cart",data)
  
  return (
    <>
    {(!isPending&& cart)&&
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
      {/* {console.log("cart items",data?.data.items)} */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-8">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.book.id}>
          <SideCartItem  item= {{
              id:item.book.id,
              title:item.book.title,
              coverImage:item.book.coverImage,
              quantity:item.quantity,
              priceAtPurchase:item.book.price}
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
            <span>{(subtotal)}$</span>
          </div>
          <div className="flex justify-between text-sm text-[#5E616C] mt-4">
            <span>Shipping (Estimated)</span>
            <span>{(Number(subtotal) + (items.length ? shippingEstimate : 0)).toFixed(2)}$</span>
          </div>
          <Divider className="my-2!" />
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{(subtotal??0+shippingEstimate)}$</span>
          </div>
        </div>
      
         <Button
         onClick={onClose}
          fullWidth
          variant="contained"
          disableElevation
          disabled={items.length === 0}
          className="bg-primary mt-8! hover:bg-blue-700 normal-case  rounded-lg text-sm font-semibold"
        >
          <Link
          className="flex items-center justify-center gap-2 w-full py-2"
          href="/cart">
          View Cart
          </Link>
        </Button>
        
      </div>
    </Drawer>}
    
    </>
  );
}

