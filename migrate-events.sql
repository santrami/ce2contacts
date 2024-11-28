-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS=0;

-- Get the Webinar activity type ID
SET @webinar_type_id = (SELECT id FROM ActivityType WHERE name = 'Webinar' LIMIT 1);

-- Migrate events to activities (if not already migrated)
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

-- Create mapping table
CREATE TEMPORARY TABLE IF NOT EXISTS event_activity_map AS
SELECT e.id as event_id, a.id as activity_id
FROM Event e
JOIN Activity a ON a.title = e.name AND a.date = e.scheduledDate;

-- Migrate participations (avoiding duplicates)
INSERT IGNORE INTO ActivityParticipation (
  activityId,
  contactId,
  role,
  attendance,
  createdAt
)
SELECT DISTINCT
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
WHERE NOT EXISTS (
  SELECT 1 FROM ActivityParticipation ap 
  WHERE ap.activityId = m.activity_id 
  AND ap.contactId = p.contactId
);

-- Drop temporary table
DROP TEMPORARY TABLE IF EXISTS event_activity_map;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Verify migration results
SELECT 
  (SELECT COUNT(*) FROM Event) as event_count,
  (SELECT COUNT(*) FROM Activity) as activity_count,
  (SELECT COUNT(*) FROM Participation) as participation_count,
  (SELECT COUNT(*) FROM ActivityParticipation) as activity_participation_count;