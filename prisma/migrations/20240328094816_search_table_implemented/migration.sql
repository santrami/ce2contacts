/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sector` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_ibfk_1`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_ibfk_1`;

-- DropForeignKey
ALTER TABLE `participation` DROP FOREIGN KEY `participation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `participation` DROP FOREIGN KEY `participation_ibfk_2`;

-- DropForeignKey
ALTER TABLE `participation` DROP FOREIGN KEY `participation_ibfk_4`;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `contact`;

-- DropTable
DROP TABLE `event`;

-- DropTable
DROP TABLE `organization`;

-- DropTable
DROP TABLE `participation`;

-- DropTable
DROP TABLE `sector`;

-- CreateTable
CREATE TABLE `SearchQuery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `query` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `organizationId` INTEGER NULL,
    `projectParticipation` BOOLEAN NULL,
    `isActive` BOOLEAN NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `Contact_userId_key`(`userId`),
    INDEX `organizationId`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acronym` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `regionalName` VARCHAR(255) NULL,
    `website` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NULL,

    UNIQUE INDEX `acronym`(`acronym`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `internalID` VARCHAR(255) NOT NULL,
    `scheduledDate` DATETIME(0) NOT NULL,
    `duration` INTEGER NOT NULL,
    `usersRegistered` INTEGER NOT NULL,
    `usersApproved` INTEGER NOT NULL,
    `usersDenied` INTEGER NOT NULL,
    `usersCancelled` INTEGER NOT NULL,
    `organizationId` INTEGER NULL,

    INDEX `organizationId`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contactId` INTEGER NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,
    `registrationTime` DATETIME(0) NOT NULL,
    `timeParticipation` INTEGER NOT NULL,
    `approvalStatus` ENUM('pending', 'approved', 'denied', 'cancelled') NOT NULL DEFAULT 'pending',
    `isHost` TINYINT NOT NULL,

    INDEX `contactId`(`contactId`),
    INDEX `eventId`(`eventId`),
    INDEX `organizationId`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SearchQuery` ADD CONSTRAINT `SearchQuery_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Participation` ADD CONSTRAINT `participation_ibfk_1` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Participation` ADD CONSTRAINT `participation_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Participation` ADD CONSTRAINT `participation_ibfk_4` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
