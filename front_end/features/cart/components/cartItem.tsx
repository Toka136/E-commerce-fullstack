import {X,Minus,Plus} from "lucide-react";
import { CartItem } from "../types/cart";
import Image from "next/image";
import { formatPrice } from "@/features/userDashboard/utils/format";
import { CircularProgress } from "@mui/material";
type props={
    item:CartItem,
    onRemove:(id:string)=>void,
    onAdd:(id:string,quantity:number)=>void,
    deletPending:boolean,
    addPending:boolean
}
export const CartItemRow=({item,onRemove,onAdd,deletPending,addPending}:props)=>{
    return(
        <>
    
        <div
              key={item.product._id}
              className="flex gap-3  relative rounded-2xl bg-white p-3 shadow-sm shadow-gray-200/60"
            >
                    {(deletPending || addPending) && (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]">
      <CircularProgress size={28} />
    </div>
  )}
              <div className="relative h-24 w-[72px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={`http://localhost:4000/api/Uploads/${item.product.coverImage}`}
                  alt={`Cover of ${item.product.title}`}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-[15px] font-bold leading-snug text-gray-900">
                      {item.product.title}
                    </h2>
                    {/* <p className="text-[13px] text-gray-500">{item.product.}</p> */}
                  </div>
                  <button
                    onClick={() => onRemove(item.product._id)}
                    aria-label={`Remove ${item.product.title} from cart`}
                    className="rounded-full p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-2">
                  <p className="text-[19px] font-bold text-indigo-600">
                    {formatPrice(item.priceAtPurchase)}
                  </p>

                  <div className="flex items-center rounded-full bg-indigo-50">
                    <button
                      onClick={() => onAdd(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.product.title}`}
                      className="p-2 text-indigo-600 disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-[14px] font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onAdd(item.product._id, item.quantity +1)}
                      aria-label={`Increase quantity of ${item.product.title}`}
                      className="p-2 text-indigo-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </>
    )
}