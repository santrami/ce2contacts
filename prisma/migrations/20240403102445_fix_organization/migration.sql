/*
  Warnings:

  - You are about to alter the column `isPanelist` on the `Contact` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Contact` MODIFY `isPanelist` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `Organization` MODIFY `acronym` VARCHAR(255) NULL,
    MODIFY `website` VARCHAR(255) NULL;
