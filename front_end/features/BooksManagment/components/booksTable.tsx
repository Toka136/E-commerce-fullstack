"use client"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { bookResponseT, booksTableParamsT, booksTableT, bookT } from "../types/Books"
import { StockBadge } from "./StockBadge"
import CustomPageination from "./Pagination"
import { useEffect, useState } from "react"
import { GetBooks } from "../api/booksApi"

export const BooksTable = ({setEditId,setDeleteId,setIsEditModalOpen,setIsDelteModalOpen,result,loading,setPage,page}:booksTableParamsT) => {
     const handleEditClick=(id:string)=>{
      setEditId(id)
      setIsEditModalOpen(true)
     }
     const handleDeleteClick=(id:string)=>{
      setDeleteId(id)
      setIsDelteModalOpen(true)
     }

    return (
        <>
        <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#eff4ff]/50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-[#444652] border-b border-[#c4c5d5]/20">
                Book Details
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#444652] border-b border-[#c4c5d5]/20">
                Category
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#444652] border-b border-[#c4c5d5]/20 text-center">
                Stock
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#444652] border-b border-[#c4c5d5]/20">
                Price
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#444652] border-b border-[#c4c5d5]/20 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c4c5d5]/10">
            {!loading && result.data.data.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-[#eff4ff]/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-auto rounded shadow-sm bg-[#dce9ff] overflow-hidden flex-shrink-0">
                      <Image alt="book cover"
                         width={52}
                          height={52}
                          sizes="52px"
                          className="object-contain object-center" 
                          priority
                          unoptimized
                        src={`http://localhost:4000/api/Uploads/${book.coverImage}`}
                       
                      />
                    </div>
                    <div>
                      <p className="text-[#0b1c30] leading-tight font-medium">
                        {book.title}
                      </p>
                      <p className="text-sm text-[#444652]">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#444652]">
                  {book.genre}
                </td>
                <td className="px-6 py-4 text-center">
                  <StockBadge stock={book.stock} />
                </td>
                <td className="px-6 py-4 font-semibold text-[#0b1c30]">
                  ${book.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                    onClick={() => handleEditClick(book._id)}
                      title="Edit"
                      className="p-2 text-[#3455b9] hover:bg-[#3455b9]/10 rounded-lg transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                    onClick={() => handleDeleteClick(book._id)}
                      title="Delete"
                      className="p-2 text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#c4c5d5]/20">
          <p className="text-sm text-[#444652]">
            Showing {result.data.pageSize} of {result.data.totalCount} books
          </p>
        {!loading && (
          <CustomPageination count={result.data.totalPage} page={page} onchange={(_,page:number) => {setPage(page)}} />
        )}
        </div>
      </div>
        </>
   
    )
}