-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS=0;

-- Drop legacy tables
DROP TABLE IF EXISTS Participation;
DROP TABLE IF EXISTS Event;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;