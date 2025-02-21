-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READY', 'IN_PROGRESS', 'PENDING', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "Issue" AS ENUM ('PERSONALIZED', 'INSTANT');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT', 'PREPAID');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('ONE_OFF', 'MONTHLY');

-- CreateEnum
CREATE TYPE "FeeImpact" AS ENUM ('ISSUANCE', 'PIN_REISSUE');

-- CreateEnum
CREATE TYPE "AccountPad" AS ENUM ('NONE', 'BRANCH_CODE_PREFIX', 'BRANCH_CODE_SUFFIX');

-- CreateEnum
CREATE TYPE "SchemeName" AS ENUM ('VISA', 'VERVE', 'MASTERCARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardScheme" (
    "id" TEXT NOT NULL,
    "name" "SchemeName" NOT NULL,
    "panLength" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "binPrefix" TEXT NOT NULL,
    "expiration" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "branchBlacklist" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardSchemeId" TEXT NOT NULL,

    CONSTRAINT "CardProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "impact" "FeeImpact" NOT NULL,
    "accountPad" "AccountPad" NOT NULL,
    "account" TEXT,
    "cardProfileId" TEXT NOT NULL,
    "cardId" TEXT,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardRequest" (
    "id" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "cardType" "CardType" NOT NULL,
    "charges" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "cardProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "expiry" INTEGER NOT NULL,
    "cardType" "CardType" NOT NULL,
    "issueType" "Issue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardToFee" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CardToFee_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_CardToFee_B_index" ON "_CardToFee"("B");

-- AddForeignKey
ALTER TABLE "CardProfile" ADD CONSTRAINT "CardProfile_cardSchemeId_fkey" FOREIGN KEY ("cardSchemeId") REFERENCES "CardScheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_cardProfileId_fkey" FOREIGN KEY ("cardProfileId") REFERENCES "CardProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardRequest" ADD CONSTRAINT "CardRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardRequest" ADD CONSTRAINT "CardRequest_cardProfileId_fkey" FOREIGN KEY ("cardProfileId") REFERENCES "CardProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToFee" ADD CONSTRAINT "_CardToFee_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToFee" ADD CONSTRAINT "_CardToFee_B_fkey" FOREIGN KEY ("B") REFERENCES "Fee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
