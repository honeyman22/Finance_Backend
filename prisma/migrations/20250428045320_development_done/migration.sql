/*
  Warnings:

  - The values [cash,credit_card] on the enum `paymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "DepositStatus" ADD VALUE 'paid';

-- AlterEnum
BEGIN;
CREATE TYPE "paymentMethod_new" AS ENUM ('bank_transfer', 'esewa');
ALTER TABLE "Deposit" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "Deposit" ALTER COLUMN "paymentMethod" TYPE "paymentMethod_new" USING ("paymentMethod"::text::"paymentMethod_new");
ALTER TYPE "paymentMethod" RENAME TO "paymentMethod_old";
ALTER TYPE "paymentMethod_new" RENAME TO "paymentMethod";
DROP TYPE "paymentMethod_old";
ALTER TABLE "Deposit" ALTER COLUMN "paymentMethod" SET DEFAULT 'bank_transfer';
COMMIT;
