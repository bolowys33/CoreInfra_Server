-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('ONE_OFF', 'MONTHLY');

-- CreateEnum
CREATE TYPE "FeeImpact" AS ENUM ('ISSUANCE', 'PIN_REISSUE');

-- CreateEnum
CREATE TYPE "AccountPad" AS ENUM ('NONE', 'BRANCH_CODE_PREFIX', 'BRANCH_CODE_SUFFIX');

-- CreateTable
CREATE TABLE "CardProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "binPrefix" TEXT NOT NULL,
    "expiration" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "currrency" "Currency" NOT NULL,
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

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardProfile" ADD CONSTRAINT "CardProfile_cardSchemeId_fkey" FOREIGN KEY ("cardSchemeId") REFERENCES "CardScheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_cardProfileId_fkey" FOREIGN KEY ("cardProfileId") REFERENCES "CardProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
