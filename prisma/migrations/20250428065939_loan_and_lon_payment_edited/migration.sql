/*
  Warnings:

  - You are about to drop the column `interest` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `loanDuration` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalInterest` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "interest",
ADD COLUMN     "loanDuration" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalFine" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalInterest" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "loanDate" SET DEFAULT CURRENT_TIMESTAMP;
