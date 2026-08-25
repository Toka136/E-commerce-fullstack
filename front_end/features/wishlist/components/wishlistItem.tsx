import { CheckCircle2, ShoppingCart, X } from "lucide-react";
import { WishlistItem } from "../types/wishlist";
import Image from "next/image";
import { StockTone } from "../utils/wiahlistFormates";
import { formatPrice } from "@/features/userDashboard/utils/format";
import {  StockBadgeW } from "./stockBadgeW";
import { useMoveToCart } from "../hooks/useMoveToCart";
import { CircularProgress } from "@mui/material";
import { useDeleteFromWishlist } from "../hooks/useDeleteFromWishlist";
import { useWishlistStore } from "../store/wishlist-store";
import Link from "next/link";
 type props={
  item:WishlistItem,
  stock:{label: string;tone: StockTone},
  isAdded:boolean,
}
export const WishlistItemCard=({item,stock,isAdded}:props)=>{
    const {mutate:moveToCart,isPending}=useMoveToCart()
    const {mutate:deleteFromWishlist,isPending:deletePending}=useDeleteFromWishlist()
    const handleMoveToCart=()=>{
      moveToCart(item.productId._id)
    }
    const handleDelete=()=>{
      deleteFromWishlist(item.productId._id)
    }
     return (
            <div
              key={item._id}
              className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm shadow-gray-200/60"
            >
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Link href={`/books/${item.productId._id}`}>

                <Image
                  src={`http://localhost:4000/api/Uploads/${item.productId.coverImage}`}
                  alt={`Cover of ${item.productId.title}`}
                  fill
                  sizes="80px"
                  
                  className="object-cover"
                />
                </Link>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <StockBadgeW tone={stock.tone} label={stock.label}/>
                  </div>
                  <button
                    onClick={() =>handleDelete()}
                    aria-label={`Remove ${item.productId.title} from wishlist`}
                    className="rounded-full p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                  >
                    {deletePending?<CircularProgress color="inherit" size={12} />:
                    <X className="h-4 w-4" />}
                  </button>
                </div>

                <h2 className="mt-1 text-[16px] font-bold leading-snug text-gray-900">
                  {item.productId.title}
                </h2>
                <p className="text-[13px] text-gray-500">{item.productId.author}</p>

                <div className="mt-auto flex items-end justify-between pt-2">
                  <p className="text-[17px] font-bold text-gray-900">
                    {formatPrice(item.productId.price)}
                  </p>
                  <button
                    onClick={() => handleMoveToCart()}
                    disabled={item.productId.stock === 0}
                    aria-label={`Add ${item.productId.title} to cart`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      "bg-indigo-600 text-white hover:bg-indigo-700"
                    } disabled:cursor-not-allowed disabled:bg-gray-300`}
                  >
                    {isPending ? (
                        <CircularProgress color="inherit" size={12} />
                    ):( <ShoppingCart className="h-4 w-4" />)}
                     
                    
                  </button>
                </div>
              </div>
            </div>
          );
}