import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
export const getCouponUsageByUserIdAndCouponId=async(userId:string,couponId:string,tx:Prisma.TransactionClient=prisma)=>{
    return await tx.couponUsage.findUnique({where:
        {
        couponId_userId: {
        couponId,
        userId,
      },
        }
    })
}
export const addCouponUsage = async (
  couponId: string,
  userId: string,
  maxUsesPerUser: number,
  tx: Prisma.TransactionClient
) => {
  const existingUsage = await tx.couponUsage.findUnique({
    where: {
      couponId_userId: {
        couponId,
        userId,
      },
    },
  });

  if (!existingUsage) {
    try {
      await tx.couponUsage.create({
        data: {
          couponId,
          userId,
          usageCount: 1,
        },
      });

      return true;
    } catch (error) {
      // Concurrent create: another request may have created it.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // Continue to atomic update below.
      } else {
        throw error;
      }
    }
  }

  const result = await tx.couponUsage.updateMany({
    where: {
      couponId,
      userId,
      usageCount: {
        lt: maxUsesPerUser,
      },
    },
    data: {
      usageCount: {
        increment: 1,
      },
    },
  });

  return result.count === 1;
};