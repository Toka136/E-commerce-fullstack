/*
  Warnings:

  - A unique constraint covering the columns `[tokenHash]` on the table `emailVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emailVerification_tokenHash_key" ON "emailVerification"("tokenHash");
