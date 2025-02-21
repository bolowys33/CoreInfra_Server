-- AlterTable
ALTER TABLE "CardRequest" ADD COLUMN     "charges" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
