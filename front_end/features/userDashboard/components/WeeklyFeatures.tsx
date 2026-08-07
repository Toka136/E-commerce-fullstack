"use client";

import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import BookCard from "./BookCard";
import { Book } from "../types/books";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

interface WeeklyFeaturesProps {
  books: Book[];
}

/** "Weekly Features" — a swipeable row of curated book cards. */
export default function WeeklyFeatures({ books }: WeeklyFeaturesProps) {
  return (
    <section className="mt-12 w-[90%] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Weekly Features
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Handpicked stories for your collection.
          </p>
        </div>
        <button
          type="button"
          className="text-primary font-label-md hover:underline flex items-center gap-2 shrink-0"
        >
          See all <ArrowRight className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 ">
        {books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} />
            </div>
        ))}
        </div>
     
    </section>
  );
}