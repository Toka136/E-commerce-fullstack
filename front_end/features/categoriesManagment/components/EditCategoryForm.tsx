import { useFormik } from "formik";
import { addCategorySchema } from "../schema/addCategorySchema";
import { Category, editCategoryT } from "../types/categories";
import { UseEditCategory } from "../hook/useEditCategory";

export const EditCategoryForm = ({ category, handleClose }: { category: Category; handleClose: () => void }) => {
    const { mutateAsync: EditCategory, isPending } = UseEditCategory()

    const handleEditCategory = async (data: editCategoryT) => {
        try {
            await EditCategory({ slug: category.slug, data })
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    const categoryFormik = useFormik<editCategoryT>(
        {
            initialValues: {
                name: category.name,
                description: category.description
            },
            onSubmit: (values) => {
                handleEditCategory(values);
            },
            validationSchema: addCategorySchema
        }
    )

    const handleCancel = () => {
        categoryFormik.resetForm()
        handleClose()
    }

    return <form onSubmit={categoryFormik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant">
                Category Name
            </label>
            <input
                type="text"
                name="name"
                onChange={categoryFormik.handleChange}
                onBlur={categoryFormik.handleBlur}
                value={categoryFormik.values.name}
                placeholder="e.g. Science Fiction"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary transition-all"
            />
        </div>
        {categoryFormik.errors.name && categoryFormik.touched.name && <p className="text-red-500">{categoryFormik.errors.name}</p>}
             <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant">
                Category Description
            </label>
            <input
                type="text"
                name="description"
                onChange={categoryFormik.handleChange}
                onBlur={categoryFormik.handleBlur}
                value={categoryFormik.values.description}
                placeholder="e.g. Science Fiction"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary transition-all"
            />
        </div>
        {categoryFormik.errors.description && categoryFormik.touched.description && <p className="text-red-500">{categoryFormik.errors.description}</p>}

        <footer className="p-6 border-t border-outline-variant/20 flex gap-4">
            <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isPending || !categoryFormik.dirty}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </footer>
    </form>
}
