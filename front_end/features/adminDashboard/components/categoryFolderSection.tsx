"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Folder } from "lucide-react"
import { Category } from "@/features/categories/types/categories"
import { AddCategoryModal } from "@/features/categoriesManagment/components/AddCategoryModal"

export default function CategoryFoldersSection({
    categories,
}: {
    categories: Category[]
}) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const visibleCategories = categories.slice(0, 5)

    return (
        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold text-on-surface">Category Folders</h2>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
                    >
                        View All
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        aria-label="Add category"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {visibleCategories.length === 0 ? (
                <p className="mt-6 text-sm text-on-surface-variant">No categories yet.</p>
            ) : (
                <div className="mt-4 flex flex-col gap-2">
                    {visibleCategories.map((category) => (
                        <div
                            key={category._id}
                            className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2.5"
                        >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Folder className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-on-surface">
                                    {category.name}
                                </p>
                                <p className="truncate text-xs text-on-surface-variant">
                                    {category.slug}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddCategoryModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </section>
    )
}