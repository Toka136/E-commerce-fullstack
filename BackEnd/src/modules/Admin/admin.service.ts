import { Prisma } from "../../generated/prisma/client";
import { booksCount, booksCountByDate, booksCountWStock0 } from "../Books/book.repo";

import { getCurrentMRevenue, getPendingRevenue, getPrevMRevenue, getRevenue } from "../Orders/order.repo";


export const getGrossRevenueStats = async (startOfCurrentMonth:Date,startOfPreviousMonth:Date,endOfPreviousMonth:Date) => {
    const [
      grossRevenue,
      currentMonthRevenue,
      previousMonthRevenue,
      pendingRevenue
    ] = await Promise.all([
       getRevenue(),
      getCurrentMRevenue(startOfCurrentMonth),
      getPrevMRevenue(startOfPreviousMonth, endOfPreviousMonth),
      getPendingRevenue()
    ]);
   const current = new Prisma.Decimal(currentMonthRevenue);
   const previous = new Prisma.Decimal(previousMonthRevenue);

    let growthRate = new Prisma.Decimal(0);

    if (previous.greaterThan(0)) {
    growthRate = current
        .minus(previous)
        .dividedBy(previous)
        .times(100);
    } else if (current.greaterThan(0)) {
    growthRate = new Prisma.Decimal(100);
    }

  
      return {
        grossRevenue: Number(grossRevenue),
        growthPercentage: Number(growthRate.toFixed(1)),
        isPositiveTrend: growthRate.greaterThanOrEqualTo(0),
        pendingRevenue: Number(pendingRevenue),
        };
   
};
export const getCatalogInventoryStats = async (startOfCurrentMonth:Date,startOfPreviousMonth:Date,endOfPreviousMonth:Date)  => {
   

    const [totalBooks, currentMonthCount, previousMonthCount, outOfStockCount] = await Promise.all([
     booksCount(),
      
      booksCountByDate(startOfCurrentMonth),
      
      booksCountByDate(startOfPreviousMonth, endOfPreviousMonth),
      
      booksCountWStock0()
    ]);

    let growthRate = 0;
    if (previousMonthCount > 0) {
      growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    } else if (currentMonthCount > 0) {
      growthRate = 100;
    }

    return  {
        totalInventory: totalBooks,
        growthPercentage: Number(growthRate.toFixed(1)), 
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

