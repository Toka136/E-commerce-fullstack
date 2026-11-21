import { Layers, DollarSign } from "lucide-react";
import { DashboardCardsData } from "../types/adminDashboard";
import StatCard from "./statCard";

export default function DashboardCards({ data }: { data: DashboardCardsData }) {
  const { inventoryStats, revenueStats } = data;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full mb-6">
      {inventoryStats && (
        <StatCard
          icon={Layers}
          label="Catalog Inventory"
          value={inventoryStats.totalInventory.toLocaleString("en-US")}
          growthPercentage={inventoryStats.growthPercentage}
          isPositiveTrend={inventoryStats.isPositiveTrend}
          footer={{
            label: "Out of Stock",
            value: `${inventoryStats.outOfStockTitles} titles`,
            tone: inventoryStats.outOfStockTitles > 0 ? "error" : "default",
          }}
        />
      )}

      {revenueStats && (
        <StatCard
          icon={DollarSign}
          iconClassName="bg-secondary/10 text-secondary"
          label="Gross Revenue"
          value={formatCurrency(revenueStats.grossRevenue)}
          growthPercentage={revenueStats.growthPercentage}
          isPositiveTrend={revenueStats.isPositiveTrend}
          footer={{
            label: "Pending Revenue",
            value: formatCurrency(revenueStats.pendingRevenue),
          }}
        />
      )}
    </div>
  );
}
