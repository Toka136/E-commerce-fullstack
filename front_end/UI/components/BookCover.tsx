"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface BookCoverProps {
  coverImage: string;
  title: string;
  className?: string;
  /** Tells Next which width to download. Match it to how wide the cover is shown. */
  sizes?: string;
  /** Use for the first image(s) visible on load. */
  priority?: boolean;
}

/**
 * Fills its parent, so the parent must be `relative` with a size
 * (e.g. `relative aspect-4/5 w-full`).
 */
export default function BookCover({
  coverImage,
  title,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: BookCoverProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !coverImage) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-surface-container-highest text-on-surface-variant ${className}`}
      >
        <BookOpen className="h-1/4 w-1/4 min-h-6 min-w-6 opacity-40" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      fill
      src={coverImage}
      alt={title}
      sizes={sizes}
      quality={90}
      priority={priority}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
    />
  );
}