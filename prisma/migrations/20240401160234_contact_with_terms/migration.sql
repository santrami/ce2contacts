/*
  Warnings:

  - You are about to drop the column `isActive` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `acceptedTerms` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPanelist` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `isActive`,
    ADD COLUMN `acceptedTerms` BOOLEAN NOT NULL,
    ADD COLUMN `isPanelist` VARCHAR(191) NOT NULL;
