/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `ASSO_TASKS_CONTACTS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CONTACTS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `INSTITUTES` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participants_CE2(6)` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projects_CE2(6)` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sister projects_Participants(1)` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sister projects_Projects(1)` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TASKS` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ASSO_TASKS_CONTACTS` DROP FOREIGN KEY `FK_ContactId`;

-- DropForeignKey
ALTER TABLE `ASSO_TASKS_CONTACTS` DROP FOREIGN KEY `FK_TaskId`;

-- DropForeignKey
ALTER TABLE `CONTACTS` DROP FOREIGN KEY `FK_InstituteId`;

-- DropIndex
DROP INDEX `user_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    ADD COLUMN `role` VARCHAR(255) NOT NULL,
    MODIFY `username` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `ASSO_TASKS_CONTACTS`;

-- DropTable
DROP TABLE `CONTACTS`;

-- DropTable
DROP TABLE `INSTITUTES`;

-- DropTable
DROP TABLE `Participants_CE2(6)`;

-- DropTable
DROP TABLE `Projects_CE2(6)`;

-- DropTable
DROP TABLE `Sister projects_Participants(1)`;

-- DropTable
DROP TABLE `Sister projects_Projects(1)`;

-- DropTable
DROP TABLE `TASKS`;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `organizationId` INTEGER NULL,
    `projectParticipation` BOOLEAN NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `organizationId`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acronym` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `regionalName` VARCHAR(255) NULL,
    `website` VARCHAR(255) NOT NULL,
    `country` VARCHAR(2) NULL,

    UNIQUE INDEX `acronym`(`acronym`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_username_key` TO `username`;
