import { UseDeleteCategory } from "../hook/useDeleteCategory";

interface deleteCategoryModalT {
    open: boolean;
    onClose: () => void;
    id: string;
}

export default function DeleteCategoryModal({ open, onClose, id }: deleteCategoryModalT) {
    const { mutateAsync: DeleteCategory, isPending } = UseDeleteCategory()

    const handleDelete = async () => {
        try {
            await DeleteCategory(id)
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center transition-colors ${open ? "" : "pointer-events-none"
                }`}
            aria-hidden={!open}
        >
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"
                    }`}
            />
            <div
                className={`relative mx-4 w-full max-w-sm rounded-2xl bg-[#f8f9ff] p-6 shadow-2xl transform transition-all duration-300 ease-out ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
            >
                <h3 className="text-lg font-bold text-on-surface">Delete Category</h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                    Are you sure you want to delete this category? Books assigned to it may be affected.
                </p>

                <div className="mt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold bg-error text-white shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
