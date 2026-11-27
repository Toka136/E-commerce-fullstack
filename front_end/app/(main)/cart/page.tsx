import { getCartServer } from "@/features/cart/api/getCartServer";
import { CartSummary } from "@/features/cart/components/cartSummary";
import { CartItemRow } from "@/features/cart/components/cartItem";
import { ShoppingCart } from "lucide-react";
import CouponCode from "@/features/orders/components/couponCodes";

export const metadata = {
  title: "Your Cart — LibroDiscovery",
};

export default async function CartRoute() {
  const {data:cartData}=await getCartServer()
  const itemsCount=cartData.items.length
  console.log("carrServer",cartData)
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7FB]">
       <main className="flex-1 px-4 pb-10 pt-5">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-[14px] text-gray-500">
              {itemsCount} {itemsCount === 1 ? "item" : "items"}
            </p>
          </div>
         
        </div>
       {itemsCount === 0 && (
                <div className="mt-16 flex flex-col items-center text-center">
                  <ShoppingCart className="h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-[16px] font-semibold text-gray-800">Your cart is empty</p>
                  <p className="mt-1 text-[14px] text-gray-500">
                    Browse the catalog and add books you&apos;d like to buy.
                  </p>
                </div>
              )}
           <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-4 md:col-span-2">
              {cartData.items.map((item) => (
                <CartItemRow key={item.book.id} item={item} />
              ))}
            </div>
            {itemsCount > 0 && (
            <div className="space-y-6 md:col-span-1">
              
                <CouponCode appliedCoupon={cartData.coupon?.code} />
              

              <CartSummary
                discountAmount={cartData.discountAmount ?? 0}
                subtotal={cartData.subtotal}
                totalPrice={(cartData.coupon?.code?cartData.totalAfterCoupon : cartData.subtotal)??0 }
                couponCode={cartData.coupon?.code}
              />
            </div>
            )}

          </div>
         
          </main>
       </div>
  )
}