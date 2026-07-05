"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Filter,
  ChevronDown,
  ArrowUpDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AddBookModal } from "@/features/BooksManagment/components/addBookModal";
import { BooksTable } from "@/features/BooksManagment/components/booksTable";
import { EditBookModal } from "@/features/BooksManagment/components/editBookModal";
import { bookResponseT } from "@/features/BooksManagment/types/Books";
import { GetBooks } from "@/features/BooksManagment/api/booksApi";
import DeleteBookModal from "@/features/BooksManagment/components/DeleteBook";
export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const[isDeleteModalOpen,setIsDeleteModalOpen]=useState(false)
  const [deleteId,setDeleteId]=useState("")
  const[editId,setEditId]=useState("")
  const [page,setPage]=useState(1)
  const [searchText,setSearchText]=useState("")
  const [loading, setLoading] = useState(true);
   const [result,setResult]=useState<bookResponseT>({
     message: "",
     statusCode: 0,
     data: {
       data: [],
       totalCount: 0,
       pageSize: 0,
       currentPage: 0,
       totalPage: 0
     }
     
   })
   const fetchBooks=async()=>{
     const res=await GetBooks({pageSize:2,currentPage:page,searchText})
     setResult(res)
     setLoading(false)

   }
   useEffect(()=>{
    fetchBooks()
    
   },[page,searchText])
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-8 space-y-6 min-h-screen">
      {/* Hero / action row */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-[#0b1c30]">Book Catalog</h3>
          <p className="text-[#444652]">
            Showing 1,284 books in your global inventory
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3455b9] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </section>

      {/* Filters bar */}
      <div className="bg-white/70 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-[#444652] border border-[#c4c5d5]/30">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">All Genres</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-[#444652] border border-[#c4c5d5]/30">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-semibold">Sort by Title</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#d3e4fe]/50 rounded-full text-[#444652] border border-[#c4c5d5]/30">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold">Low Stock Only</span>
        </button>

        <button className="ml-auto flex items-center gap-2 text-[#3455b9] font-semibold hover:underline">
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

    <BooksTable setDeleteId={setDeleteId} setIsDelteModalOpen={setIsDeleteModalOpen} setEditId={setEditId} setIsEditModalOpen={setIsEditModalOpen} result={result} page={page} setPage={setPage} loading={loading} />

      <AddBookModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EditBookModal fetchBooks={fetchBooks} open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} id={editId}/>
          <DeleteBookModal fetchBooks={fetchBooks} open={isDeleteModalOpen} onClose={() =>setIsDeleteModalOpen(false) } id={deleteId} />
    </div>
  );
}
