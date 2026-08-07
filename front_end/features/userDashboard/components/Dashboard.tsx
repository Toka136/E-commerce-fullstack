'use client'
import SearchBar from "./SearchBar";
import WeeklyFeatures from "./WeeklyFeatures";
import CategoryGrid from "./CategoryGrid";
import RecentlyAdded from "./RecentlyAdded";
import { Book, gteBooksParams } from "../types/books";
import { useGetBooks } from "../hooks/useGetBooks";
import { CircularProgress } from "@mui/material";

interface DashboardProps {
  books: Book[];
  // categories: Category[];
  totalCount: number;
}

/** Dashboard-only view: search, weekly features, categories, recently added. */
export default function Dashboard({pageSize,currentPage,searchText}:gteBooksParams) {
   const {data,isPending,error}=useGetBooks({
    pageSize: pageSize,
    currentPage: currentPage,
    searchText: searchText,
  })
  console.log("data",data)
  return (
    <main className="pt-8 max-w-container-max mx-auto px-md md:px-lg bg-[#F8F9FF]">
       {isPending &&<div className="flex justify-center items-center pt-8 bg-[#F8F9FF] h-screen">
        <CircularProgress color="primary" /></div>}
      {error && <p>{error.message}</p>}
      {data && <>
      <WeeklyFeatures books={data?.data.books} />
      {/* <CategoryGrid categories={categories} /> */}
      <RecentlyAdded books={data?.data.books} totalCount={data.data.totalCount} />
      </>}
    </main>
  );
}
