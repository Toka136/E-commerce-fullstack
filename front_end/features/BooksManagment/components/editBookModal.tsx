import { X } from "lucide-react";
import { editBookModalT } from "../types/Books";
import { EditBookForm } from "./editBookFrom";

export function EditBookModal({ open, onClose, book, categories }: editBookModalT) {
  console.log("book edit", book);

  if (!open) return null; // لتجنب مشاكل الرندر عندما تكون المغلقة غير نشطة

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* الـ Overlay / Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* النافذة الجانبية / Sidebar Modal */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#f8f9ff] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low shrink-0">
          <h3 className="text-lg font-bold text-primary">Edit Book</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <EditBookForm categories={categories} book={book} handleClose={onClose} />
        </div>
      </div>
    </div>
  );
}