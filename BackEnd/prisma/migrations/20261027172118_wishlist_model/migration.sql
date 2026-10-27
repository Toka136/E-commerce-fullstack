-- CreateTable
CREATE TABLE "wishList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "wishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookTowishList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookTowishList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishList_userId_key" ON "wishList"("userId");

-- CreateIndex
CREATE INDEX "_BookTowishList_B_index" ON "_BookTowishList"("B");

-- AddForeignKey
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookTowishList" ADD CONSTRAINT "_BookTowishList_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookTowishList" ADD CONSTRAINT "_BookTowishList_B_fkey" FOREIGN KEY ("B") REFERENCES "wishList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
