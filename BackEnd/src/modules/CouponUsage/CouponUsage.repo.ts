import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
export const getCouponUsageByUserIdAndCouponId=async(userId:string,couponId:string,tx:Prisma.TransactionClient=prisma)=>{
    return await tx.couponUsage.count({where:{userId,couponId}})
}