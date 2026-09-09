"use client"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Category } from "../types/categories"
import { EditCategoryModal } from "./EditCategoryModal"
import DeleteCategoryModal from "./DeleteCategoryModal"

export const CategoriesTable = ({ categories }: { categories: Category[] }) => {
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null)

    const handleEditClick = (category: Category) => {
        setCategoryToEdit(category)
    }

    const handleDeleteClick = (id: string) => {
        setCategoryIdToDelete(id)
    }

    return (
        <>
            <div className="bg-white overflow-scroll rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] ">
                <table className="w-full text-left border-collapse ">
                    <thead className="bg-surface-container-low/50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                                Category Name
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                                Slug
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20">
                                Description
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant border-b border-outline-variant/20 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {categories.map((category) => (
                            <tr
                                key={category._id}
                                className="hover:bg-surface-container-low/30 transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <p className="text-[#0b1c30] leading-tight font-medium">
                                        {category.name}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant">
                                    {category.slug}
                                </td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant">
                                    {category.description??"---"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            title="Edit"
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category._id)}
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

                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20">
                    <p className="text-sm text-on-surface-variant">
                        Showing {categories.length} of {categories.length} categories
                    </p>
                </div>
            </div>

            {categoryToEdit && (
                <EditCategoryModal
                    open={!!categoryToEdit}
                    onClose={() => setCategoryToEdit(null)}
                    category={categoryToEdit}
                />
            )}
            {categoryIdToDelete && (
                <DeleteCategoryModal
                    open={!!categoryIdToDelete}
                    onClose={() => setCategoryIdToDelete(null)}
                    id={categoryIdToDelete}
                />
            )}
        </>
    )
}
