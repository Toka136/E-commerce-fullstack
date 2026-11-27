"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { Book } from "../types/books";
import { formatPrice } from "../utils/utils";
import BookCover from "@/UI/components/BookCover";
import { useAddToCartMutation } from "@/features/cart/hooks/useAddToCart";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useAuth } from "@/providers/AuthProvider";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";

interface BookCardProps {
  book: Book;
  badge?: string;
  eyebrow?: string;
}

export default function BookCard({ book, badge, eyebrow }: BookCardProps) {
  const { isGuest } = useAuth();
  const { mutate: addToCart, isPending: cartPending } = useAddToCartMutation();
  const { mutate: addToWishlist, isPending: wishlistPending } = useAddToWishlist();
   const {data:response} = useGetWishlist()

  const [justAdded, setJustAdded] = useState(false);
  const inWishlist =
    justAdded || !!response?.data.items.some((item) => item.id === book.id);

  const isOutOfStock = book.stock <= 0;

  const requireLogin = () => {
    if (isGuest) {
      toast.warning("You need to login first");
      return true;
    }
    return false;
  };

  const onAdd = () => {
    if (requireLogin()) return;
    addToCart({ productId: book.id, quantity: 1 });
  };

  const onWishlist = () => {
    if (requireLogin()) return;
    if (inWishlist) {
      toast.info("Already in your wishlist");
      return;
    }
    addToWishlist(book.id, { onSuccess: () => setJustAdded(true) });
  };

  return (
    <article className="flex h-full flex-col rounded-lg border border-[#E2E8F0] bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      {/* Cover */}
      <div className="relative">
        <Link href={`/books/${book.id}`} className="block">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-md bg-slate-200">
            <BookCover coverImage={book.coverImage} title={book.title} />
          </div>
        </Link>

        {(isOutOfStock || badge) && (
          <span
            className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              isOutOfStock ? "bg-black/70 text-white" : "bg-white/90 text-[#0B66D0]"
            }`}
          >
            {isOutOfStock ? "Out of stock" : badge}
          </span>
        )}

        <button
          type="button"
          onClick={onWishlist}
          disabled={wishlistPending}
          aria-label={inWishlist ? `${book.title} is in your wishlist` : `Add ${book.title} to wishlist`}
          aria-pressed={inWishlist}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 shadow-sm transition-colors hover:bg-white disabled:opacity-50"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist
                ? "fill-[#0B66D0] text-[#0B66D0]"
                : "text-[#334155] hover:text-[#0B66D0]"
            }`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="flex grow flex-col px-2 pb-2 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0B66D0]">
          {eyebrow ?? (book as any).category?.name ?? "Featured"}
        </p>
        <h3 className="mt-2 line-clamp-1 text-base font-bold text-[#0F172A]">
          {book.title}
        </h3>
        <p className="mt-3 line-clamp-1 text-[13px] text-[#64748B]">{book.author}</p>
        <p className="mt-3 line-clamp-2 min-h-[2.8em] text-xs leading-relaxed text-[#64748B]">
          {(book as any).description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[#E2E8F0] pt-4">
          <span className="text-base font-bold text-[#0F172A]">
            {formatPrice(book.price)}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || cartPending}
            onClick={onAdd}
            aria-label={`Add ${book.title} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#0B66D0] transition-colors hover:bg-[#0B66D0] hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            {cartPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}