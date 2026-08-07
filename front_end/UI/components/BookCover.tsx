"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
// import { getCoverImageUrl } from "@/lib/api";

interface BookCoverProps {
  coverImage: string;
  title: string;
  className?: string;
}

/**
 * Renders a book cover from the backend's `coverImage` filename. Falls back
 * to a quiet placeholder if the file 404s, so a broken upload never breaks
 * the grid.
 */
export default function BookCover({ coverImage, title, className = "" }: BookCoverProps) {
  const [errored, setErrored] = useState(false);
  // const src = getCoverImageUrl(coverImage);

  if (errored||!coverImage)  {
    return (
      <div
        className={`flex items-center justify-center bg-surface-container-highest text-on-surface-variant ${className}`}
      >
        <BookOpen className="w-1/4 h-1/4 min-w-6 min-h-6 opacity-40" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // Backend-hosted, dynamically-named files — a plain <img> avoids
    // configuring a remote pattern for every possible upload host.
    // eslint-disable-next-line @next/next/no-img-element
    <img
     src={`http://localhost:4000/api/Uploads/${coverImage}`}
      alt={title}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
