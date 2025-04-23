/*
  Warnings:

  - The `fine` column on the `Deposit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "fine",
ADD COLUMN     "fine" DOUBLE PRECISION,
ALTER COLUMN "receipt" DROP NOT NULL;
