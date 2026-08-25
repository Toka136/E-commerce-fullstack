"use client";

import { useState } from "react";
import { BookReview } from "@/features/userDashboard/types/book";
import {
  formatPublishedDate,
  getInitials,
} from "@/features/userDashboard/utils/format";
import {
  Star,
  Pen,
  Trash2,
} from "lucide-react";

import { EditReviewForm } from "./editReviewForm";
import { DeleteReviewDialog } from "./deleteReviewDialog";
import { useEditReview } from "../hooks/useEditReview";
import { addReviewAProps, editReviewAProps } from "../types/review";

interface ReviewCardProps {
  review: BookReview;
  access: boolean;
  onEdit?: (data:editReviewAProps) => void;
  onDelete?: (reviewId: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export const ReviewCard = ({
  review,
  access,
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
}: ReviewCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.review);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleEdit = () => {
    if ( !rating) return;

    onEdit?.(
      {
        reviewId: review._id,
        rating,
        review: reviewText,
      }
    );

    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setRating(review.rating);
    setReviewText(review.review);
    setEditMode(false);
  };

  const handleDelete = () => {
    onDelete?.(review._id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        className="rounded-2xl border border-indigo-50 bg-indigo-50/60 p-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-semibold text-white">
              {getInitials(review.userId?.userName ?? "?")}
            </div>

            <p className="text-[14px] font-semibold text-gray-800">
              {access ? "You" : review.userId?.userName ?? "Anonymous reader"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[12px] text-gray-500">
              {formatPublishedDate(review.updatedAt)}
            </span>

            {access && !editMode && (
              <div className="flex items-center gap-1">
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  disabled={isDeleting}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-indigo-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Edit review"
                >
                  <Pen className="h-3.5 w-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleting}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete review"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {editMode ? (
          <EditReviewForm 
            review={review}
            handleEdit={handleEdit}
            isEditing={isEditing}
            isDeleting={isDeleting}
            handleCancelEdit={handleCancelEdit}
            reviewText={reviewText}
            rating={rating}
            setRating={(rating) => setRating(rating)}
            setReviewText={(reviewText) => setReviewText(reviewText)}
          />
        ) : (
          /* ================= NORMAL VIEW ================= */
          <>
            {/* Rating */}
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Review */}
            <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
              {review.review}
            </p>
          </>
        )}
      </div>

      {/* ================= DELETE DIALOG ================= */}
      <DeleteReviewDialog 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={(open) => setDeleteDialogOpen(open)}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};