/*
  Warnings:

  - You are about to drop the column `isPanelist` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `internalID` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isHost` on the `Participation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Participation` table. All the data in the column will be lost.
  - Added the required column `internalEventId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Participation` DROP FOREIGN KEY `participation_ibfk_4`;

-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `isPanelist`,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `internalID`,
    ADD COLUMN `internalEventId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Participation` DROP COLUMN `isHost`,
    DROP COLUMN `organizationId`,
    ADD COLUMN `isPanelist` BOOLEAN NULL,
    MODIFY `registrationTime` DATETIME(0) NULL,
    MODIFY `timeParticipation` INTEGER NULL,
    MODIFY `approvalStatus` ENUM('pending', 'approved', 'denied', 'cancelled') NULL DEFAULT 'pending';
