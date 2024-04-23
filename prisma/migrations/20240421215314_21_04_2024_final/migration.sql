/*
  Warnings:

  - Made the column `projectParticipation` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_termsId_fkey`;

-- AlterTable
ALTER TABLE `Contact` MODIFY `projectParticipation` BOOLEAN NOT NULL,
    MODIFY `termsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_termsId_fkey` FOREIGN KEY (`termsId`) REFERENCES `Terms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
