CREATE DATABASE IF NOT EXISTS `ce2-contacts`;
USE `ce2-contacts`;

-- Grant privileges to sramirez user
GRANT ALL PRIVILEGES ON `ce2-contacts`.* TO 'sramirez'@'%';
FLUSH PRIVILEGES;