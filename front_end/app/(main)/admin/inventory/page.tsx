
import { Plus, Filter, ChevronDown, ArrowUpDown, AlertTriangle, RefreshCw,} from "lucide-react";
import { AddBookModal } from "@/features/BooksManagment/components/addBookModal";
import { BooksTable } from "@/features/BooksManagment/components/booksTable";
import { EditBookModal } from "@/features/BooksManagment/components/editBookModal";
import { bookResponseT } from "@/features/BooksManagment/types/Books";
import DeleteBookModal from "@/features/BooksManagment/components/DeleteBook";
import { gteBooksParams } from "@/features/userDashboard/types/books";
import { getBooksA } from "@/features/userDashboard/api/getBooks";
import { getCategoriesA } from "@/features/categories/api/getCategories";
import { AddBookParent } from "@/features/BooksManagment/components/addBookParent";
interface StorePageProps {
  // Next.js (app router, v15+) passes searchParams as a Promise on the
  // server. If you're on an older version, drop the `await` below and
  // type this as a plain object instead.
  searchParams: Promise<gteBooksParams>;
}
export default async function InventoryPage({ searchParams }: StorePageProps) {

     const params = await searchParams;
     
   
     const { data: result } = await getBooksA({
       pageSize:  params.pageSize??4,
       currentPage: params.currentPage,
       searchText: params.searchText,
       category: params.category,
       minPrice: params.minPrice,
       maxPrice:  params.maxPrice,
       sort:  params.sort
     });
     console.log("result book",result)
     const {data:categories}=await getCategoriesA()
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-8 space-y-6 min-h-screen">
      {/* Hero / action row */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-[#0b1c30]">Book Catalog</h3>
          <p className="text-on-surface-variant">
            Showing 1,284 books in your global inventory
          </p>
        </div>
        <AddBookParent categories={categories} />
      </section>

      {/* Filters bar */}
      <div className="bg-white/70 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-on-surface-variant  border border-outline-variant/30">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">All Genres</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-on-surface-variant  border border-outline-variant/30">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-semibold">Sort by Title</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-on-surface-variant  border border-outline-variant/30">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold">Low Stock Only</span>
        </button>

      
      </div>

    <BooksTable  result={result} categories={categories}   />

      
    </div>
  );
}
