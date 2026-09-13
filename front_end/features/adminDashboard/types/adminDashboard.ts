export interface InventoryStats {
  totalInventory: number
  growthPercentage: number
  isPositiveTrend: boolean
  outOfStockTitles: number
}

export interface RevenueStats {
  grossRevenue: number
  growthPercentage: number
  isPositiveTrend: boolean
  pendingShipments: number
}

export interface DashboardCardsData {
  inventoryStats: InventoryStats
  revenueStats: RevenueStats
}

export interface DashboardCardsResponse {
  status: string
  message: string
  data: DashboardCardsData
}