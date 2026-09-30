"use client";

import {  Heart, Plus } from "lucide-react";
import { Book } from "../types/books";
import { formatPrice } from "../utils/utils";
import BookCover from "@/UI/components/BookCover";
import { CircularProgress } from "@mui/material";
import { useAddToCartMutation } from "@/features/cart/hooks/useAddToCart";
import Link from "next/link";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";

interface BookCardProps {
  book: Book;
  eyebrow?: string;
} 
export default function BookCard({ book, eyebrow }: BookCardProps) {
  const isOutOfStock = book.stock <= 0;
  const { mutate: addToCartMutation, isPending } = useAddToCartMutation();
  const onAdd = () => {
     addToCartMutation({
               productId: book._id,
               quantity: 1
              });
  }
 

  return (
    <div className="bg-white hover:-translate-y-0.5 relative rounded-2xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Upper Cover Container */}
              <Link href={`/books/${book._id}`}>
             
      <div className="relative aspect-4/5  w-full bg-[#679198] flex items-center justify-centeroverflow-hidden">
        <BookCover coverImage={book.coverImage} title={book.title} />
        {isOutOfStock && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </div>
      </Link>


      {/* Content Container */}
      <div className="p-4 flex flex-col grow justify-between bg-white">
        <div>
          {/* Eyebrow Label */}
          <p className="text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-1">
            {eyebrow ?? "Featured"}
          </p>

          {/* Book Title */}
          <h3 className="text-base font-bold text-[#1E293B] line-clamp-1 leading-snug">
            {book.title}
          </h3>

          {/* Author Name */}
          <p className="text-xs text-[#64748B] font-medium line-clamp-1 mt-0.5">
            {book.author}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="flex justify-between items-center mt-4 pt-1">
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
            className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#4F46E5] hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {isPending?<CircularProgress color="primary" />:
            <Plus className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
}