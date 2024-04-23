-- AlterTable
ALTER TABLE `Contact` ADD COLUMN `sectorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
