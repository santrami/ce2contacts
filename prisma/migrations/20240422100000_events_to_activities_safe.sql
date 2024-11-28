-- First, safely drop foreign keys if they exist
SET @dbname = DATABASE();
SET @tablename = "Participation";
SET @constraintname = "participation_ibfk_2";
SET @cmd = CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY ', @constraintname);
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.table_constraints
        WHERE constraint_schema = @dbname
        AND table_name = @tablename
        AND constraint_name = @constraintname
    ),
    @cmd,
    'SELECT 1'
) INTO @sqlstmt;
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create new tables
CREATE TABLE IF NOT EXISTS `ActivityType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert activity types only if they don't exist
INSERT IGNORE INTO `ActivityType` (`name`) VALUES 
('Webinar'),
('Workshop'),
('Survey'),
('Interview'),
('Focus Group');

-- Create Activity table if it doesn't exist
CREATE TABLE IF NOT EXISTS `Activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `activityTypeId` int NOT NULL,
  `date` datetime NOT NULL,
  `duration` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `organizationId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activityTypeId` (`activityTypeId`),
  KEY `organizationId` (`organizationId`),
  CONSTRAINT `Activity_activityTypeId_fkey` FOREIGN KEY (`activityTypeId`) REFERENCES `ActivityType` (`id`),
  CONSTRAINT `Activity_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ActivityParticipation table if it doesn't exist
CREATE TABLE IF NOT EXISTS `ActivityParticipation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activityId` int NOT NULL,
  `contactId` int NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `attendance` boolean DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ActivityParticipation_activityId_contactId_key` (`activityId`, `contactId`),
  KEY `contactId` (`contactId`),
  CONSTRAINT `ActivityParticipation_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity` (`id`),
  CONSTRAINT `ActivityParticipation_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrate existing events to activities
SET @webinar_type_id = (SELECT id FROM ActivityType WHERE name = 'Webinar');

INSERT IGNORE INTO Activity (
  title,
  activityTypeId,
  date,
  duration,
  website,
  organizationId,
  createdAt,
  updatedAt
)
SELECT 
  name,
  @webinar_type_id,
  scheduledDate,
  duration,
  website,
  organizationId,
  NOW(),
  NOW()
FROM Event;

-- Create a temporary table to map Event IDs to Activity IDs
CREATE TEMPORARY TABLE IF NOT EXISTS event_activity_map AS
SELECT e.id as event_id, a.id as activity_id
FROM Event e
JOIN Activity a ON a.title = e.name AND a.date = e.scheduledDate;

-- Migrate participations using the mapping table
INSERT IGNORE INTO ActivityParticipation (
  activityId,
  contactId,
  role,
  attendance,
  createdAt
)
SELECT 
  m.activity_id,
  p.contactId,
  CASE 
    WHEN p.isPanelist = 1 THEN 'panelist'
    ELSE 'participant'
  END,
  CASE 
    WHEN p.approvalStatus = 'approved' THEN true
    WHEN p.approvalStatus = 'denied' THEN false
    ELSE NULL
  END,
  COALESCE(p.registrationTime, NOW())
FROM Participation p
JOIN event_activity_map m ON p.eventId = m.event_id;

-- Drop temporary table if it exists
DROP TEMPORARY TABLE IF EXISTS event_activity_map;

-- Verify the migration
SELECT 
  (SELECT COUNT(*) FROM Event) as event_count,
  (SELECT COUNT(*) FROM Activity) as activity_count,
  (SELECT COUNT(*) FROM Participation) as participation_count,
  (SELECT COUNT(*) FROM ActivityParticipation) as activity_participation_count;
