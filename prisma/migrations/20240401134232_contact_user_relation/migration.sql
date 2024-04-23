/*
  Warnings:

  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contactId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_userId_fkey`;

-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `contactId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_contactId_key` ON `User`(`contactId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
