import { getCards } from "@/features/adminDashboard/api/getCards"
import CategoryFoldersSection from "@/features/adminDashboard/components/categoryFolderSection"
import DashboardCards from "@/features/adminDashboard/components/dashBoardCards"
import RecentOrdersSection from "@/features/adminDashboard/components/recentorderssection"
import { getCategoriesA } from "@/features/categories/api/getCategories"

import { getOrdersApi } from "@/features/orders/api/getOrders"

export default async function AdminDashboardPage() {
    const [{ data: cardsData }, { data: orders }, { data: categories }] =
        await Promise.all([getCards(), getOrdersApi(), getCategoriesA()])

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
                <p className="text-sm text-on-surface-variant">
                    Overview of your store
                </p>
            </div>

            <DashboardCards data={cardsData} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentOrdersSection orders={orders} />
                </div>
                <CategoryFoldersSection categories={categories} />
            </div>
        </div>
    )
}