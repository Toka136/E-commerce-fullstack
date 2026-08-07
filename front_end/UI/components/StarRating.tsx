import { Star } from "lucide-react";

interface StarRatingProps {
  average: number;
  count: number;
  className?: string;
}

/** Compact star + count readout. Renders nothing meaningful for unrated books. */
export default function StarRating({ average, count, className = "" }: StarRatingProps) {
  if (count === 0) {
    return <span className={`text-label-sm text-outline ${className}`}>Not yet rated</span>;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
      <span className="text-label-sm text-on-surface-variant">
        {average.toFixed(1)}{" "}
        <span className="text-outline">
          ({count})
        </span>
      </span>
    </div>
  );
}
