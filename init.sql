-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ce2;
USE ce2;

-- Create ActivityType table first (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS ActivityType (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Organization table (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS Organization (
    id INT PRIMARY KEY AUTO_INCREMENT,
    acronym VARCHAR(255) UNIQUE,
    fullName VARCHAR(255) NOT NULL,
    regionalName VARCHAR(255),
    website VARCHAR(255),
    country VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Sector table (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS Sector (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Terms table (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS Terms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Tag table (no foreign key dependencies)
CREATE TABLE IF NOT EXISTS Tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    color VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Contact table (depends on Organization, Sector, Terms)
CREATE TABLE IF NOT EXISTS Contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    organizationId INT,
    projectParticipation BOOLEAN NOT NULL DEFAULT false,
    network BOOLEAN NOT NULL DEFAULT false,
    sectorId INT,
    termsId INT,
    country VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id),
    FOREIGN KEY (sectorId) REFERENCES Sector(id),
    FOREIGN KEY (termsId) REFERENCES Terms(id)
);

-- Create User table (depends on Contact)
CREATE TABLE IF NOT EXISTS User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    emailResetPassword TEXT,
    passwordResetTokenExpires DATETIME,
    contactId INT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id)
);

-- Create Activity table (depends on ActivityType, Organization)
CREATE TABLE IF NOT EXISTS Activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activityTypeId INT NOT NULL,
    date DATETIME NOT NULL,
    duration INT,
    location VARCHAR(255),
    website VARCHAR(255),
    organizationId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (activityTypeId) REFERENCES ActivityType(id),
    FOREIGN KEY (organizationId) REFERENCES Organization(id)
);

-- Create ActivityParticipation table (depends on Activity, Contact)
CREATE TABLE IF NOT EXISTS ActivityParticipation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activityId INT NOT NULL,
    contactId INT NOT NULL,
    role VARCHAR(255),
    attendance BOOLEAN,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_activity_contact (activityId, contactId),
    FOREIGN KEY (activityId) REFERENCES Activity(id),
    FOREIGN KEY (contactId) REFERENCES Contact(id)
);

-- Create TagsOnContacts table (depends on Contact, Tag)
CREATE TABLE IF NOT EXISTS TagsOnContacts (
    contactId INT NOT NULL,
    tagId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contactId, tagId),
    FOREIGN KEY (contactId) REFERENCES Contact(id),
    FOREIGN KEY (tagId) REFERENCES Tag(id)
);

-- Create TagsOnOrganizations table (depends on Organization, Tag)
CREATE TABLE IF NOT EXISTS TagsOnOrganizations (
    organizationId INT NOT NULL,
    tagId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (organizationId, tagId),
    FOREIGN KEY (organizationId) REFERENCES Organization(id),
    FOREIGN KEY (tagId) REFERENCES Tag(id)
);

-- Create SearchQuery table (depends on User)
CREATE TABLE IF NOT EXISTS SearchQuery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    query VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    filters JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id)
);

-- Create ContactChange table (depends on Contact)
CREATE TABLE IF NOT EXISTS ContactChange (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contactId INT NOT NULL,
    field VARCHAR(255) NOT NULL,
    oldValue TEXT,
    newValue TEXT,
    changedBy INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contact(id)
);

-- Create OrganizationChange table (depends on Organization)
CREATE TABLE IF NOT EXISTS OrganizationChange (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organizationId INT NOT NULL,
    field VARCHAR(255) NOT NULL,
    oldValue TEXT,
    newValue TEXT,
    changedBy INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES Organization(id)
);

-- Insert default sectors
INSERT INTO Sector (name) VALUES 
('Research'),
('Government'),
('Private Sector'),
('NGO'),
('Education'),
('Research & Academia');

-- Insert default terms
INSERT INTO Terms (description) VALUES 
('I agree to the terms and conditions of the Climateurope2 platform.');

-- Insert default activity types
INSERT INTO ActivityType (name) VALUES 
('Webinar'),
('Workshop'),
('Survey'),
('Interview'),
('Focus Group');