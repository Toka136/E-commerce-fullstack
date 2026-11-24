/*
  Warnings:

  - You are about to drop the column `expireDate` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "expireDate";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "expireDate" TIMESTAMP(3);
