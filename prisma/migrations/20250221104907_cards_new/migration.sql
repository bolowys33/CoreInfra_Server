/*
  Warnings:

  - Added the required column `issueType` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Issue" AS ENUM ('PERSONALIZED', 'INSTANT');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "issueType" "Issue" NOT NULL;

-- AlterTable
ALTER TABLE "Fee" ADD COLUMN     "cardId" TEXT;

-- CreateTable
CREATE TABLE "_CardToFee" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CardToFee_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CardToFee_B_index" ON "_CardToFee"("B");

-- AddForeignKey
ALTER TABLE "_CardToFee" ADD CONSTRAINT "_CardToFee_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToFee" ADD CONSTRAINT "_CardToFee_B_fkey" FOREIGN KEY ("B") REFERENCES "Fee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
