/*
  Warnings:

  - You are about to drop the column `usedAt` on the `CouponUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[couponId,userId]` on the table `CouponUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CouponUsage_couponId_userId_idx";

-- AlterTable
ALTER TABLE "CouponUsage" DROP COLUMN "usedAt",
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "CouponUsage_couponId_userId_key" ON "CouponUsage"("couponId", "userId");
