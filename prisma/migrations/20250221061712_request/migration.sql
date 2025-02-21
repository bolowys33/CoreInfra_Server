-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READY', 'IN_PROGRESS', 'PENDING', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "CardRequest" (
    "id" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "cardType" "CardType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "cardProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CardRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardRequest" ADD CONSTRAINT "CardRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardRequest" ADD CONSTRAINT "CardRequest_cardProfileId_fkey" FOREIGN KEY ("cardProfileId") REFERENCES "CardProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
