import Hero from "./Hero";
import WeeklyFeatures from "./WeeklyFeatures";
import RecentlyAdded from "./RecentlyAdded";
import { gteBooksParams } from "../types/books";
import { getBooksA } from "../api/getBooks";
import { getCategoriesA } from "@/features/categories/api/getCategories";

export default async function Dashboard({ pageSize, currentPage, searchText, category }: gteBooksParams & { category?: string }) {
  const [data, categories] = await Promise.all([
    getBooksA({ pageSize, currentPage, searchText, category } as gteBooksParams),
    getCategoriesA(),
  ]);

  if (!data) return null;
  const { books, totalCount } = data.data;

  return (
    <main className="mx-auto max-w-container-max bg-[#F7FBFE] px-4 md:px-8">
      <Hero  />
      <WeeklyFeatures books={books} categories={categories.data} />
      {/* <RecentlyAdded books={books} totalCount={totalCount} /> */}
    </main>
  );
}