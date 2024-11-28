-- Create temporary tables to store unique records
CREATE TEMPORARY TABLE temp_activities AS
SELECT DISTINCT 
    MIN(id) as id,
    title,
    activityTypeId,
    date,
    duration,
    website,
    organizationId,
    createdAt,
    updatedAt
FROM Activity
GROUP BY title, date, organizationId;

CREATE TEMPORARY TABLE temp_participations AS
SELECT DISTINCT 
    MIN(id) as id,
    activityId,
    contactId,
    role,
    attendance,
    createdAt
FROM ActivityParticipation
GROUP BY activityId, contactId;

-- Delete all records from the original tables
DELETE FROM ActivityParticipation;
DELETE FROM Activity;

-- Reinsert only unique records
INSERT INTO Activity
SELECT * FROM temp_activities;

INSERT INTO ActivityParticipation
SELECT * FROM temp_participations;

-- Drop temporary tables
DROP TEMPORARY TABLE temp_activities;
DROP TEMPORARY TABLE temp_participations;

-- Verify results
SELECT 
    (SELECT COUNT(*) FROM Event) as event_count,
    (SELECT COUNT(*) FROM Activity) as activity_count,
    (SELECT COUNT(*) FROM Participation) as participation_count,
    (SELECT COUNT(*) FROM ActivityParticipation) as activity_participation_count;