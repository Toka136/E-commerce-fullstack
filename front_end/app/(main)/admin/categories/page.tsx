import { getCategories } from "@/features/categoriesManagment/api/getCategories"
import { CategoriesManager } from "@/features/categoriesManagment/components/CategoriesManager"

export default async function AdminCategoriesPage() {
    const data = await getCategories()
    // console.log("categories", categories)

    return (
        <div className="p-8">
            <CategoriesManager categories={data.data} />
        </div>
    )
}
