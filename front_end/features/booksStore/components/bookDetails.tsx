"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Layers,
  PackageCheck,
  Loader,
} from "lucide-react";
import { BookDetails, BookReview } from "@/features/userDashboard/types/book";
import {  getCoverImageUrl, stockLabel } from "@/features/userDashboard/utils/format";
import { formatPrice } from "@/features/userDashboard/utils/utils";
import { useAddToCartMutation } from "@/features/cart/hooks/useAddToCart";
import { useAddToWishlist } from "@/features/wishlist/hooks/useAddToWishlist";
import { useAddReview } from "@/features/reviews/hooks/useAddReview";
import ReviewForm from "@/features/reviews/components/reviewForm";
import { ReviewCard } from "@/features/reviews/components/reviewCard";
import { useAuthStore } from "@/features/Auth/store/auth-store";
import { useEditReview } from "@/features/reviews/hooks/useEditReview";
import { addReviewAProps, editReviewAProps } from "@/features/reviews/types/review";
import { useDeleteReview } from "@/features/reviews/hooks/useDeleteReview";


interface BookDetailProps {
  book: BookDetails;
  bookReviews: BookReview[];
}

export default function BookDetail({ book, bookReviews }: BookDetailProps) {
  const [quantity, setQuantity] = useState(1);
  console.log("bookReviews",bookReviews)
  const coverUrl = useMemo(() => getCoverImageUrl(book.coverImage), [book.coverImage]);
  const stock = stockLabel(book);
  const {userData}=useAuthStore()
  const { mutate: addReview, isPending: addReviewPending, isError: addReviewError, isSuccess: addReviewSuccess,} = useAddReview()
   const {mutate:editReview,isPending:editReviewPending}=useEditReview()
   const {mutate:deleteReview,isPending:deleteReviewPending}=useDeleteReview()


  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(book.stock, q + 1));
  const { mutate: addToCartMutation } = useAddToCartMutation();
    const {mutate:addToWishlist,isPending:wishlistPending}=useAddToWishlist()
    const onWishlist=()=>{
      addToWishlist(book._id)
      
      console.log("added to wishlist")
    }
    const onEditReview=(data:editReviewAProps)=>{
      editReview(data)
    }
    const onDeleteReview=(reviewId:string)=>{
      deleteReview(reviewId)
    }
  
  const onAdd = () => {
     addToCartMutation({
               productId: book._id,
               quantity: quantity
              });
  }
  return (
    <div className="min-h-screen bg-[#F7F7FB] pb-28">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 px-4 py-3 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/books/?category=${book.category.slug}`} className="hover:text-gray-700">
          {book.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-indigo-600">{book.title}</span>
      </nav>
    <div className="flex gap-4 md:flex-row flex-col">
      {/* Cover image */}
      <div className="px-4 w-full md:w-[50%]"> 
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-900">
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            // fill
            // sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover h-auto w-full"
            // priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pt-5 w-full md:w-[48%]">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
          {book.category.name}
        </span>

        <h1 className="mt-3 text-[28px] font-bold leading-tight text-gray-900">
          {book.title}
        </h1>
        <p className="mt-1 text-[15px] text-gray-500">by {book.author}</p>

        {/* Rating */}
        {/* <div className="mt-2 flex items-center gap-2">
          {hasRatings ? (
            <>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(book.rate.average)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[13px] text-gray-500">
                {book.rate.average.toFixed(1)} ({book.rate.count} Reviews)
              </span>
            </>
          ) : (
            <span className="text-[13px] text-gray-400">No reviews yet</span>
          )}
        </div> */}

        {/* Price */}
        <p className="mt-3 text-[26px] font-bold text-indigo-600">
          {formatPrice(book.price)}
        </p>

        {/* Synopsis */}
        <section className="mt-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Synopsis
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
            {book.description}
          </p>
        </section>

        {/* Info grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
          <div className="flex items-start gap-2">
            <Layers className="mt-0.5 h-4 w-4 text-gray-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Pages
              </p>
              <p className="text-[14px] font-medium text-gray-800">{book.pages} Pages</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <PackageCheck
              className={`mt-0.5 h-4 w-4 ${
                stock.tone === "out"
                  ? "text-red-400"
                  : stock.tone === "low"
                  ? "text-amber-500"
                  : "text-emerald-500"
              }`}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Availability
              </p>
              <p
                className={`text-[14px] font-medium ${
                  stock.tone === "out"
                    ? "text-red-500"
                    : stock.tone === "low"
                    ? "text-amber-600"
                    : "text-gray-800"
                }`}
              >
                {stock.label}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity + Add to cart */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-3 text-gray-500 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-[15px] font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= book.stock}
              aria-label="Increase quantity"
              className="p-3 text-gray-500 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
          onClick={onAdd  }
            disabled={book.stock === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>

        <button onClick={onWishlist} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 py-3.5 text-[15px] font-semibold text-indigo-600 transition hover:bg-indigo-50">
          {wishlistPending && <Loader className="h-4 w-4 animate-spin" />}
          <Heart className="h-4 w-4" />
          Save to Wishlist
        </button>
         
        
      </div>
</div>
<div>
  {/* Reviews */}
        {bookReviews.length > 0 && (
          <div className="flex justify-between items-start flex-col mt-8 md:flex-row w-[90%] mx-auto">
            <div className="mt-8 md:w-[40%] w-full">
               <>
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(book.rate.average)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[18px] text-gray-500 ">
                {book.rate.average.toFixed(1)} ({book.rate.count} Reviews)
              </span>
              <ReviewForm
                bookId={book._id}
                addReview={addReview}
                isPending={addReviewPending}
                isError={addReviewError}
                isSuccess={addReviewSuccess}
              />

            </>
          </div>
          <section className="mt-8 md:w-[50%] w-full">
            <h2 className="text-[17px] font-bold text-gray-900">Reader Reviews</h2>
            <div className="mt-3 space-y-3">
              {bookReviews.map((review) => (
                <ReviewCard key={review._id} review={review} access={userData._id===review.userId._id} onEdit={onEditReview} isEditing={editReviewPending} onDelete={onDeleteReview} isDeleting={deleteReviewPending}/>
              ))}
            </div>
          </section>
          
          </div>
        )}
</div>
      
    </div>
  );
}