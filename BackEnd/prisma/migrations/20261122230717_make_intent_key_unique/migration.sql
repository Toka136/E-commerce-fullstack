/*
  Warnings:

  - A unique constraint covering the columns `[intentKey]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_intentKey_key" ON "Payment"("intentKey");
