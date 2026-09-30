"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Category } from "../types/categories"
import { AddCategoryModal } from "./AddCategoryModal"
import { CategoriesTable } from "./CategoriesTable"

export const CategoriesManager = ({ categories }: { categories: Category[] }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">Categories</h1>
                    <p className="text-sm text-on-surface-variant">
                        Manage your book categories
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-primary text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <CategoriesTable categories={categories} />

            <AddCategoryModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    )
}
