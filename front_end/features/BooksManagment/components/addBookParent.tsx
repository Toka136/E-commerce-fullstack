"use client"
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddBookModal } from "./addBookModal";
import { Category } from "@/features/categories/types/categories";

export const AddBookParent = ({categories}:{categories:Category[]}) => {
    const[isModalOpen, setIsModalOpen] = useState(false);
    return(
        <div>
          <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
         <AddBookModal categories={categories} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
};