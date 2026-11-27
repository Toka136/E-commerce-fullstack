"use client";

import { PlusCircle } from "lucide-react";
import { Book } from "../types/books";
import { formatPrice } from "../utils/utils";
import BookCover from "@/UI/components/BookCover";
import { CircularProgress } from "@mui/material";
import { useAddToCartMutation } from "@/features/cart/hooks/useAddToCart";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

interface BookListItemProps {
  book: Book;
  badge?: string;
 
}

/** Horizontal row card used in lists. */
export default function BookListItem({ book, badge }: BookListItemProps) {
  const isOutOfStock = book.stock <= 0;
  const{isGuest}=useAuth()
  const { mutate: addToCartMutation, isPending } = useAddToCartMutation();
  const onAdd = () => {
    if(isGuest) {
      toast.warning("You need to login first")
      return
    }
     addToCartMutation({
               productId: book.id,
               quantity: 1
              });
             
  }
  return (
    <div  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ">
      {/* Book Cover Thumbnail */}
      <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900 shadow-sm relative">
        <BookCover coverImage={book.coverImage} title={book.title} />
      </div>

      {/* Book Details */}
      <div onClick={()=>redirect(`/books/${book.id}`)} className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer">
        <h4 className="text-base font-bold text-[#1E293B] line-clamp-1 leading-snug">
          {book.title}
        </h4>
        
        <p className="text-xs text-[#64748B] font-medium line-clamp-1 mt-0.5">
          {book.author}
          {book.category.name && (
            <span className="text-[#64748B]"> • {book.category.name}</span>
          )}
        </p>

        {badge && (
          <div className="mt-2 flex">
            <span className="px-2.5 py-0.5 rounded-full bg-[#8C7CFF]/20 text-[#6C5CE7] text-[10px] font-bold uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Price and Add Action */}
      <div className="flex flex-col items-end justify-between shrink-0 self-stretch py-0.5">
        <span className="text-sm font-bold text-[#4F46E5]">
          {formatPrice(book.price)}
        </span>

        <button
          
          type="button"
          disabled={isOutOfStock||isPending}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          aria-label={`Add ${book.title} to cart`}
          className="text-[#4F46E5] hover:text-[#3730A3] cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          {isPending?<CircularProgress color="primary" />:
                     
          <PlusCircle className="w-5 h-5 stroke-2" />}
        </button>
      </div>
    </div>
  );
}