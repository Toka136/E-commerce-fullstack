import bookModal from "../Books/book.modal";
import orderModal from "../Orders/order.modal";
import { getCurrentMRevenue, getPendingRevenue, getPrevMRevenue, getRevenue } from "../Orders/order.repo";


export const getGrossRevenueStats = async (startOfCurrentMonth:Date,startOfPreviousMonth:Date,endOfPreviousMonth:Date) => {
    const [
      totalRevenueResult,
      currentMonthRevenueResult,
      previousMonthRevenueResult,
      pendingShipmentsCount
    ] = await Promise.all([
       getRevenue(),
      getCurrentMRevenue(startOfCurrentMonth),
      getPrevMRevenue(startOfPreviousMonth, endOfPreviousMonth),
      getPendingRevenue()
    ]);

    const grossRevenue = totalRevenueResult[0]?.total || 0;
    const currentMonthRevenue = currentMonthRevenueResult[0]?.total || 0;
    const previousMonthRevenue = previousMonthRevenueResult[0]?.total || 0;

    let growthRate = 0;
    if (previousMonthRevenue > 0) {
      growthRate = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      growthRate = 100;
    }

  
      return {
        grossRevenue,
        growthPercentage: Number(growthRate.toFixed(1)),
        isPositiveTrend: growthRate >= 0,
        pendingShipments: pendingShipmentsCount
      }
   
};
export const getCatalogInventoryStats = async (startOfCurrentMonth:Date,startOfPreviousMonth:Date,endOfPreviousMonth:Date)  => {
   

    const [totalBooks, currentMonthCount, previousMonthCount, outOfStockCount] = await Promise.all([
      bookModal.countDocuments(),
      
      bookModal.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
      
      bookModal.countDocuments({ 
        createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } 
      }),
      
      bookModal.countDocuments({ stock: 0 })
    ]);

    let growthRate = 0;
    if (previousMonthCount > 0) {
      growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    } else if (currentMonthCount > 0) {
      growthRate = 100;
    }

    return  {
        totalInventory: totalBooks,
        growthPercentage: Number(growthRate.toFixed(1)), // تقريب لمنزلة عشرية واحدة
        isPositiveTrend: growthRate >= 0,
        outOfStockTitles: outOfStockCount
      }
  

  
};
export const getCardsS=async()=>{
     const now = new Date();
    
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const inventoryStats = await getCatalogInventoryStats(startOfCurrentMonth,startOfPreviousMonth,endOfPreviousMonth);
    const revenueStats = await getGrossRevenueStats(startOfCurrentMonth, startOfPreviousMonth, endOfPreviousMonth);
    return {
        inventoryStats,
        revenueStats
    }
}

