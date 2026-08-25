import WeeklyFeatures from "./WeeklyFeatures";
import RecentlyAdded from "./RecentlyAdded";
import { Book, gteBooksParams } from "../types/books";
import { CircularProgress } from "@mui/material";
import { getBooksA } from "../api/getBooks";

interface DashboardProps {
  books: Book[];
  // categories: Category[];
  totalCount: number;
}

/** Dashboard-only view: search, weekly features, categories, recently added. */
export default async function Dashboard({pageSize,currentPage,searchText}:gteBooksParams) {
   const data=await getBooksA({pageSize,currentPage,searchText})
  console.log("data",data)
  return (
    <main className="pt-8 max-w-container-max mx-auto px-md md:px-lg bg-[#F8F9FF]">
   
      {data && <>
      <WeeklyFeatures books={data?.data.books} />
      {/* <CategoryGrid categories={categories} /> */}
      <RecentlyAdded books={data?.data.books} totalCount={data.data.totalCount} />
      </>}
    </main>
  );
}
