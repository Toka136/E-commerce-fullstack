import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BookCard from "./BookCard";
import { Book } from "../types/books";
import { Category } from "@/features/categories/types/categories";
import CategoryTabs from "@/features/booksStore/components/CategoryTabs";

interface WeeklyFeaturesProps {
  books: Book[];
  categories: Category[];
}

// Placeholder badges until your Book type has a real field (e.g. book.badge).

export default function WeeklyFeatures({ books, categories }: WeeklyFeaturesProps) {
  return (
    <section id="features" className="scroll-mt-6 border-t border-[#E2E8F0] pt-8">
      <p className="text-sm md:text-md text-on-surface]">A fresh stack for curious readers</p>

      <div className="mt-1 flex items-end justify-between">
        <h2 className="font-serif text-4xl text-[#0F172A]">This week&apos;s features</h2>
        <Link
          href="/books"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#0B66D0] hover:underline"
        >
          See all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-8">
        <CategoryTabs categories={categories} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 pb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {books.map((book, i) => (
          <BookCard key={book.id} book={book}  />
        ))}
      </div>
    </section>
  );
}