-- CreateTable
CREATE TABLE "resetPassword" (
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "resetPassword_userId_key" ON "resetPassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "resetPassword_tokenHash_key" ON "resetPassword"("tokenHash");

-- AddForeignKey
ALTER TABLE "resetPassword" ADD CONSTRAINT "resetPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
