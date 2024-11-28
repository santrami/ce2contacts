-- First, create the new activity-related tables
CREATE TABLE `ActivityType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default activity types first
INSERT INTO `ActivityType` (`name`) VALUES 
('Webinar'),
('Workshop'),
('Survey'),
('Interview'),
('Focus Group');

-- Create Activity table
CREATE TABLE `Activity` (
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

CREATE TABLE `ActivityParticipation` (
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

-- Store the webinar type ID
SET @webinar_type_id = (SELECT id FROM ActivityType WHERE name = 'Webinar');

-- Debug: Print the webinar type ID
SELECT @webinar_type_id as webinar_type_id;

-- Debug: Print events before migration
SELECT COUNT(*) as events_before_migration FROM Event;

-- Migrate existing events to activities with more detailed logging
INSERT INTO Activity (
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

-- Debug: Print activities after migration
SELECT COUNT(*) as activities_after_migration FROM Activity;

-- Create and populate mapping table with more flexible joining
CREATE TEMPORARY TABLE event_activity_map AS
SELECT 
    e.id as event_id, 
    MIN(a.id) as activity_id  -- Use MIN to ensure one-to-one mapping
FROM Event e
JOIN Activity a ON a.title = e.name
GROUP BY e.id;

-- Debug: Print mapping counts
SELECT COUNT(*) as mapping_count FROM event_activity_map;

-- Debug: Print sample mappings
SELECT * FROM event_activity_map LIMIT 5;

-- Migrate participations with error handling
INSERT INTO ActivityParticipation (
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
JOIN event_activity_map m ON p.eventId = m.event_id
WHERE m.activity_id IS NOT NULL;

-- Drop temporary table
DROP TEMPORARY TABLE event_activity_map;

-- Final verification with detailed counts
SELECT 
  'Events' as type, COUNT(*) as count FROM Event
UNION ALL
SELECT 'Activities', COUNT(*) FROM Activity
UNION ALL
SELECT 'Original Participations', COUNT(*) FROM Participation
UNION ALL
SELECT 'Migrated Participations', COUNT(*) FROM ActivityParticipation;

-- Additional verification queries
SELECT 
  a.title,
  COUNT(ap.id) as participant_count
FROM Activity a
LEFT JOIN ActivityParticipation ap ON a.id = ap.activityId
GROUP BY a.id, a.title
ORDER BY participant_count DESC;