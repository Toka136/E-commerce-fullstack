import CategoryTabs from "@/features/booksStore/components/CategoryTabs";
import FilterSortBar from "@/features/booksStore/components/filterBar";
import Pagination from "@/features/booksStore/components/Pagination";
import SearchBar from "@/features/booksStore/components/searchBar";
import { getCategoriesA } from "@/features/categories/api/getCategories";
import { getBooksA } from "@/features/userDashboard/api/getBooks";
import BookCard from "@/features/userDashboard/components/BookCard";
import { gteBooksParams } from "@/features/userDashboard/types/books";
import { Suspense } from "react";



interface StorePageProps {
  // Next.js (app router, v15+) passes searchParams as a Promise on the
  // server. If you're on an older version, drop the `await` below and
  // type this as a plain object instead.
  searchParams: Promise<gteBooksParams>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  

  const { data } = await getBooksA({
    pageSize:  params.pageSize??2,
    currentPage: params.currentPage,
    searchText: params.searchText,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice:  params.maxPrice,
    sort:  params.sort
  });
  const {data:categories}=await getCategoriesA()
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">

      <main className="px-4 pt-4">
        <Suspense fallback={<div className="h-12 mb-4 rounded-full bg-[#EEF2FF] animate-pulse" />}>
          <SearchBar />
        </Suspense>

        <Suspense fallback={<div className="h-10 mb-4" />}>
          <div className="mb-4 w-[90%] mx-auto mt-8">
            <CategoryTabs categories={[{_id:"All",name:"All",slug:"All",description:"All"},...categories]} />
          </div>
        </Suspense>

        <Suspense fallback={<div className="h-10 mb-5" />}>
          <FilterSortBar />
        </Suspense>

        {data.books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[28%__28%_28%] gap-12 w-[90%] mx-auto">
            {data.books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white py-16 text-center text-sm text-[#64748B]">
            No books match your search. Try a different title, author, or category.
          </div>
        )}

        <Suspense fallback={null}>
          <Pagination totalPages={data.totalPage} currentPage={data.currentPage} />
        </Suspense>
      </main>

    </div>
  );
}