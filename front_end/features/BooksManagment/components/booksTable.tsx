"use client"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { booksTableParamsT, editBookT } from "../types/Books"
import { StockBadge } from "./StockBadge"
import CustomPagination from "@/features/booksStore/components/Pagination"
import { EditBookModal } from "./editBookModal"
import { useState } from "react"
import DeleteBookModal from "./DeleteBook"

export const BooksTable = ({ result, categories }: booksTableParamsT) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);
  const [book, setBook] = useState<editBookT | null>(null);

  const handleEditClick = (id: string, bookData: editBookT) => {
    setIsEditModalOpen(true);
    setBook(bookData);
  };

  const handleDeleteClick = (id: string) => {
    setIsDeleteModalOpen(true);
    setBookIdToDelete(id);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                Book Details
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                Category
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20 text-center">
                Stock
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                Price
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {result.books && result.books.map((bookItem) => (
              <tr
                key={bookItem._id}
                className="hover:bg-surface-container-low/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-auto rounded shadow-sm bg-surface-container-high overflow-hidden shrink-0">
                      <Image 
                        alt="book cover"
                        width={52}
                        height={52}
                        sizes="52px"
                        className="object-contain object-center" 
                        priority
                        unoptimized
                        src={`http://localhost:4000/api/Uploads/${bookItem.coverImage}`}
                      />
                    </div>
                    <div>
                      <p className="text-[#0b1c30] leading-tight font-medium">
                        {bookItem.title}
                      </p>
                      <p className="text-sm text-on-surface-variant">{bookItem.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {bookItem.category.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <StockBadge stock={bookItem.stock} />
                </td>
                <td className="px-6 py-4 font-semibold text-[#0b1c30]">
                  ${bookItem.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(bookItem._id, bookItem)}
                      title="Edit"
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(bookItem._id)}
                      title="Delete"
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20">
          <p className="text-sm text-on-surface-variant">
            Showing {result.books.length} of {result.totalCount} books
          </p>
          <CustomPagination totalPages={result.totalPage} currentPage={result.currentPage} />
        </div>
      </div>

      {/* Modals Outside the Table Container */}
      {book && (
        <EditBookModal  
          categories={categories} 
          open={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setBook(null);
          }} 
          book={book}
        />
      )}
      
      {bookIdToDelete && (
        <DeleteBookModal 
          open={isDeleteModalOpen} 
          onClose={() => {
            setIsDeleteModalOpen(false);
            setBookIdToDelete(null);
          }} 
          id={bookIdToDelete}
        />
      )}
    </>
  );
};