import { formatPrice } from "@/features/userDashboard/utils/format"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
export type cartProps={
    discountAmount:number;
    subtotal:number;
    totalPrice:number;
    couponCode?:string
}
export const CartSummary=({discountAmount,subtotal,totalPrice,couponCode}:cartProps)=>{
  console.log("totalPrice",totalPrice)
    return (
         <section className="mt-8 rounded-2xl bg-[#EAEBFB] p-5  w-full">
            <h2 className="text-[19px] font-bold text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-3 text-[14px] text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>
             
              {(discountAmount||0)>0&&<div className="flex items-center justify-between">
                <span>{couponCode}</span>
                <span className="font-medium text-gray-900">-{formatPrice(discountAmount||0)}</span>
              </div>}
             
            </div>

            <div className="my-4 border-t border-gray-300/60" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-gray-900">Total</span>
              <span className="text-[22px] font-bold text-primary">
                {formatPrice(totalPrice||0)}</span>
            </div>

            <Link href={"/checkout"}  className="mt-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-700">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link >

            <button className="mt-3 cursor-pointer w-full text-center text-[14px] font-semibold text-primary hover:text-indigo-700">
              Continue Shopping
            </button>
          </section>
    )
}