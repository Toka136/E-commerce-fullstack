import { UploadCloud, X } from "lucide-react";
import { addBookModalT } from "../types/Books";
import { AddBookForm } from "./addBookForm";

export function AddBookModal({open,onClose,categories}: addBookModalT) {
  return (
    <div
      className={`fixed inset-0 z-100 transition-colors ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#f8f9ff] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
          <h3 className="text-lg font-bold text-primary">Add New Book</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </header>

      <AddBookForm categories={categories} handleClose={onClose}/>
      </div>
    </div>
  );
}