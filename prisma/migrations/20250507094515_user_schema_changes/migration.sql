/*
  Warnings:

  - Added the required column `activationDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('inactive', 'active', 'deactivate');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'inactive';
