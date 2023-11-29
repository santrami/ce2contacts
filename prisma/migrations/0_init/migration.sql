-- CreateTable
CREATE TABLE `ASSO_TASKS_CONTACTS` (
    `task_id` INTEGER NOT NULL,
    `contact_id` INTEGER NOT NULL,

    INDEX `FK_ContactId`(`contact_id`),
    PRIMARY KEY (`task_id`, `contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CONTACTS` (
    `contact_id` INTEGER NOT NULL AUTO_INCREMENT,
    `institute_id` INTEGER NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `job_title` VARCHAR(255) NULL DEFAULT 'NONE',
    `gender` ENUM('M', 'F', 'N') NOT NULL,

    INDEX `FK_InstituteId`(`institute_id`),
    PRIMARY KEY (`contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INSTITUTES` (
    `institute_id` INTEGER NOT NULL AUTO_INCREMENT,
    `short_name` VARCHAR(50) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(2048) NOT NULL,
    `country` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`institute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participants_CE2(6)` (
    `Programme` TEXT NULL,
    `Grant agreement ID` TEXT NULL,
    `Project` TEXT NULL,
    `Participants` TEXT NULL,
    `Country` TEXT NULL,
    `EU contribution` TEXT NULL,
    `Activity type` TEXT NULL,
    `Coordinator` TEXT NULL,
    `Keywords` TEXT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projects_CE2(6)` (
    `Programme` TEXT NULL,
    `Grant agreement ID` TEXT NULL,
    `Project acronym` TEXT NULL,
    `Title` TEXT NULL,
    `URL` TEXT NULL,
    `Project start date` TEXT NULL,
    `Project end date` TEXT NULL,
    `Funded under` TEXT NULL,
    `Total cost` TEXT NULL,
    `EU contribution` TEXT NULL,
    `Main program` TEXT NULL,
    `Programmes` TEXT NULL,
    `Topics` TEXT NULL,
    `Call for proposal` TEXT NULL,
    `Funding scheme` TEXT NULL,
    `Coordinated by` TEXT NULL,
    `EU contribution to coordinator` TEXT NULL,
    `Programme period` TEXT NULL,
    `Keywords` TEXT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sister projects_Participants(1)` (
    `Programme` TEXT NULL,
    `Grant agreement ID` BIGINT NULL,
    `Project` TEXT NULL,
    `Participants` TEXT NULL,
    `Country` TEXT NULL,
    `EU contribution` TEXT NULL,
    `Activity type` TEXT NULL,
    `Coordinator` TEXT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sister projects_Projects(1)` (
    `Programme` TEXT NULL,
    `Grant agreement ID` BIGINT NULL,
    `Project acronym` TEXT NULL,
    `Title` TEXT NULL,
    `URL` TEXT NULL,
    `Project start date` TEXT NULL,
    `Project end date` TEXT NULL,
    `Funded under` TEXT NULL,
    `Total cost` TEXT NULL,
    `EU contribution` TEXT NULL,
    `Main program` TEXT NULL,
    `Programmes` TEXT NULL,
    `Topics` TEXT NULL,
    `Call for proposal` TEXT NULL,
    `Funding scheme` TEXT NULL,
    `Coordinated by` TEXT NULL,
    `EU contribution to coordinator` TEXT NULL,
    `Programme period` TEXT NULL,
    `Keywords` TEXT NULL,
    `Classification` TEXT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TASKS` (
    `task_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(2048) NULL DEFAULT 'NONE',

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ASSO_TASKS_CONTACTS` ADD CONSTRAINT `FK_ContactId` FOREIGN KEY (`contact_id`) REFERENCES `CONTACTS`(`contact_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ASSO_TASKS_CONTACTS` ADD CONSTRAINT `FK_TaskId` FOREIGN KEY (`task_id`) REFERENCES `TASKS`(`task_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CONTACTS` ADD CONSTRAINT `FK_InstituteId` FOREIGN KEY (`institute_id`) REFERENCES `INSTITUTES`(`institute_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

