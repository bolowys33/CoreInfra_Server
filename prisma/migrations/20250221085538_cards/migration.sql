-- AlterEnum
ALTER TYPE "CardType" ADD VALUE 'PREPAID';

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "expiry" INTEGER NOT NULL,
    "cardType" "CardType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
