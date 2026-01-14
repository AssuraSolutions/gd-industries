/*
  Warnings:

  - You are about to drop the column `freeShippingThreshold` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "freeShippingThreshold",
DROP COLUMN "shippingCost",
DROP COLUMN "taxRate",
ALTER COLUMN "currency" SET DEFAULT 'LKR';
