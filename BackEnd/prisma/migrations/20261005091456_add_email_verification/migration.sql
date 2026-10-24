-- CreateTable
CREATE TABLE "emailVerification" (
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "emailVerification_userId_key" ON "emailVerification"("userId");

-- AddForeignKey
ALTER TABLE "emailVerification" ADD CONSTRAINT "emailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
