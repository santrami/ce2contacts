/*
  Warnings:

  - You are about to drop the column `acceptedTerms` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `termsId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `acceptedTerms`,
    ADD COLUMN `termsId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Terms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_termsId_fkey` FOREIGN KEY (`termsId`) REFERENCES `Terms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
