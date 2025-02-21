/*
  Warnings:

  - You are about to drop the column `currrency` on the `CardProfile` table. All the data in the column will be lost.
  - Added the required column `currency` to the `CardProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardProfile" DROP COLUMN "currrency",
ADD COLUMN     "currency" "Currency" NOT NULL;
