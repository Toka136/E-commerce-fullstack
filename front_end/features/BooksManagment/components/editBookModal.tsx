import { X } from "lucide-react";
import {  editBookModalT } from "../types/Books";
import { EditBookForm } from "./editBookFrom";


export function EditBookModal({open,onClose,id,fetchBooks}: editBookModalT) {
  return (
    <div
      className={`fixed inset-0 z-100 transition-colors ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#213145]/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#f8f9ff] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="px-6 py-4 border-b border-[#c4c5d5]/20 flex justify-between items-center bg-[#eff4ff]">
          <h3 className="text-lg font-bold text-[#3455b9]">Edit Book</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#dce9ff] rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#444652]" />
          </button>
        </header>
      <EditBookForm id={id} handleClose={onClose} fetchBooks={fetchBooks}/>
      </div>
    </div>
  );
}