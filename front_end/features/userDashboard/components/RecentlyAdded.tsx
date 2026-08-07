import { Book } from "../types/books";
import BookListItem from "./BookListItem";

interface RecentlyAddedProps {
  books: Book[];
  totalCount: number;
}

const LOW_STOCK_THRESHOLD = 5;

/** "Recently Added" — newest books first, with an honest low-stock badge. */
export default function RecentlyAdded({ books, totalCount }: RecentlyAddedProps) {
  if (books.length === 0) return null;

  const sorted = [...books].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="mt-12 w-[90%] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-md font-display text-on-surface">
          Recently Added
        </h2>
        <span className="text-label-4 font-semibold text-outline">{totalCount} Books Total</span>
      </div>
      <div className="flex flex-col gap-8 mb-12">
        {sorted.map((book) => (
          <BookListItem
            key={book._id}
            book={book}
            badge={
              book.stock === 0
                ? "Out of stock"
                : book.stock <= LOW_STOCK_THRESHOLD
                ? `Only ${book.stock} left`
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
