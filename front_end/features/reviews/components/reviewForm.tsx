"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { addReviewAProps } from "../types/review"

interface ReviewFormProps {
  bookId: string
  addReview: (data: addReviewAProps) => void
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  errorMsg?: string
}

export default function ReviewForm({
  bookId,
  addReview,
  isPending,
  isError,
  isSuccess,
  errorMsg,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")

  const handleSubmit = () => {
    if (rating === 0) return

    addReview({
      bookId,
      rating,
      review,
    })

    setRating(0)
    setReview("")
  }

  const isValid = rating >= 1 && rating <= 5

  return (
    <div className="mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">
        Write a Review
      </h2>

      {/* Rating */}
      <div className="mt-4">
        <p className="text-xs font-medium tracking-wide text-gray-500">
          RATING
        </p>

        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1
            const filled = starValue <= (hoverRating || rating)

            return (
              <button
                key={starValue}
                type="button"
                aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                aria-pressed={rating === starValue}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  size={22}
                  className={
                    filled
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-transparent text-gray-300"
                  }
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Review text */}
      <div className="mt-4">
        <label
          htmlFor="review-comment"
          className="text-xs font-medium tracking-wide text-gray-500"
        >
          YOUR REVIEW
        </label>

        <textarea
          id="review-comment"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts on this book..."
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || isPending}
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>

      {isError && (
        <p className="mt-2 text-xs text-red-500">
          {errorMsg}
        </p>
      )}

      {isSuccess && (
        <p className="mt-2 text-xs text-green-600">
          Thanks for your review!
        </p>
      )}
    </div>
  )
}