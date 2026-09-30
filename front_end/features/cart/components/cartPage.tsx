"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {ShoppingCart,Trash2,ArrowRight,Info,} from "lucide-react";

import { useGetCart } from "../hooks/useGetCart";
import { CircularProgress } from "@mui/material";
import { formatPrice } from "@/features/userDashboard/utils/format";
import { CartItemRow } from "./cartItem";
import { useAddToCartMutation } from "../hooks/useAddToCart";
import { useRemoveFromCartMutation } from "../hooks/useRemoveFromCart";
import Link from "next/link";

export default function CartPage() {
  const {data,isPending,error}=useGetCart()
  const itemsCount=data?.data.items.length??0;
    const { mutate: addToCartMutation, isPending: cartPending } = useAddToCartMutation();
      const { mutate: removeFromCartMutation,isPending:cartRemovePending } = useRemoveFromCartMutation();
  const onRemove=(id:string)=>{
    removeFromCartMutation({productId:id})
  }
  const onAdd=(id:string,quantity:number)=>{
    addToCartMutation({productId:id,quantity:quantity})
  }
  console.log("cart data",data)

  return (
    <>
    {isPending&&<div className="flex min-h-screen flex-col bg-[#F7F7FB]">
        <CircularProgress/>
        </div>}
        {data&&
    <div className="flex min-h-screen flex-col bg-[#F7F7FB]">
    

      {/* Body */}
      <main className="flex-1 px-4 pb-10 pt-5">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-[14px] text-gray-500">
              {itemsCount} {itemsCount === 1 ? "item" : "items"}
            </p>
          </div>
          {/* {itemsCount > 0 && (
            <button
            //   onClick={clearCart}
              className="flex items-center gap-1.5 pt-1 text-[14px] font-semibold text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          )} */}
        </div>

        {/* Empty state */}
        {itemsCount === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <ShoppingCart className="h-10 w-10 text-gray-300" />
            <p className="mt-3 text-[16px] font-semibold text-gray-800">Your cart is empty</p>
            <p className="mt-1 text-[14px] text-gray-500">
              Browse the catalog and add books you&apos;d like to buy.
            </p>
          </div>
        )}
        <div className="flex justify-between items-center flex-col md:flex-row mt-10">
        {/* Cart items */}
        <div className="mt-5 space-y-4 md:w-[50%] w-full">
          {data.data.items.map((item) => (
            <CartItemRow key={item.product._id} item={item} onRemove={onRemove} onAdd={onAdd} deletPending={cartRemovePending} addPending={cartPending} />  
          ))}
        </div>

        {/* Order summary */}
        {itemsCount > 0 && (
          <section className="mt-8 rounded-2xl bg-[#EAEBFB] p-5 md:w-[40%] w-full">
            <h2 className="text-[19px] font-bold text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-3 text-[14px] text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(data.data.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Shipping
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </span>
                <span className="font-medium text-gray-900">{formatPrice(5)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Tax</span>
                <span className="font-medium text-gray-900">{formatPrice(5)}</span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-300/60" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-gray-900">Total</span>
              <span className="text-[22px] font-bold text-primary">{formatPrice(data.data.subtotal)}</span>
            </div>

            <Link href={"/checkout"}  className="mt-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-700">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link >

            <button className="mt-3 cursor-pointer w-full text-center text-[14px] font-semibold text-primary hover:text-indigo-700">
              Continue Shopping
            </button>
          </section>
        )}
        </div>
      </main>

    </div>}
    </>
  );
}
