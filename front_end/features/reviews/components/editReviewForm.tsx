import { BookReview } from "@/features/userDashboard/types/book";
import { Check, Star, X } from "lucide-react";
import { editReviewAProps } from "../types/review";
type EditReviewFormProps = {
    review: BookReview;
    handleEdit: (data:editReviewAProps) => void;
    isEditing: boolean;
    isDeleting: boolean;
    handleCancelEdit: () => void;
    rating: number;
    setRating: (rating: number) => void;
    setReviewText: (reviewText: string) => void;
    reviewText: string;
}
export const EditReviewForm = ({ review, handleEdit, isEditing, isDeleting, handleCancelEdit, reviewText, rating, setRating, setReviewText}: EditReviewFormProps) => {
  console.log("review",review);
    return (
        /* ================= EDIT FORM ================= */
          <div className="mt-4">
            {/* Rating */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-gray-700">
                Your rating
              </p>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starNumber = i + 1;

                  return (
                    <button
                      key={starNumber}
                      type="button"
                      onClick={() => setRating(starNumber)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${starNumber} stars`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          starNumber <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review */}
            <div className="mt-3">
              <label
                htmlFor={`review-${review._id}`}
                className="mb-2 block text-[13px] font-medium text-gray-700"
              >
                Your review
              </label>

              <textarea
                id={`review-${review._id}`}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Write your review..."
              />
            </div>

            {/* Actions */}
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleEdit({reviewId: review._id,  rating, review: reviewText })}
                disabled={!reviewText.trim() || isEditing}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {isEditing ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
    )
};