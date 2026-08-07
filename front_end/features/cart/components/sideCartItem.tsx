import { IconButton } from "@mui/material"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"
import {  UICartItem } from "../types/cart";
import { useChangeQuantity } from "../utils/changeQuantity";
import { useCartStore } from "../store/cart-store";
import { useAddToCartMutation } from "../hooks/useAddToCart";
import { useRemoveFromCartMutation } from "../hooks/useRemoveFromCart";
interface sideCartItemProps{
     item: UICartItem;
}
export default function SideCartItem({item}:sideCartItemProps){
    const { mutate: addToCartMutation, isPending } = useAddToCartMutation();
    const { mutate: removeFromCartMutation } = useRemoveFromCartMutation();
  
  const onQuantityChange=(quantity:number)=>{
    if(quantity===0)  
      removeFromCartMutation({productId:item.id})
      else
    addToCartMutation({productId:item.id,quantity})
  }
  
    return(
          <div key={item.id} className="flex gap-3">
              <div className="relative w-14 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={`http://localhost:4000/api/Uploads/${item.coverImage}`}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <IconButton
                      size="small"
                      className="p-1!"
                      onClick={() =>
                        onQuantityChange( Math.max(0, item.quantity - 1))
                      }
                      aria-label={`Decrease quantity of ${item.title}`}
                      disabled={isPending}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <span className="text-sm w-5 text-center select-none">
                      {item.quantity}
                    </span>
                    <IconButton
                      size="small"
                      className="!p-1"
                      onClick={() => onQuantityChange( item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      disabled={isPending}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </div>

                  <span className="text-sm font-semibold text-[#4362BE]">
                    {(item.priceAtPurchase)}
                  </span>
                </div>
              </div>
            </div>
    )
}