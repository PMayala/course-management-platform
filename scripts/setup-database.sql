-- Course Management Platform Database Setup Script

-- Create databases
CREATE DATABASE IF NOT EXISTS course_management;
CREATE DATABASE IF NOT EXISTS course_management_test;

-- Create user for application (optional, for production)
-- CREATE USER IF NOT EXISTS 'courseapp'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT ALL PRIVILEGES ON course_management.* TO 'courseapp'@'localhost';
-- GRANT ALL PRIVILEGES ON course_management_test.* TO 'courseapp'@'localhost';
-- FLUSH PRIVILEGES;

-- Use the main database
USE course_management;

-- Show created databases
SHOW DATABASES LIKE 'course_management%';

-- Success message
SELECT 'Database setup completed successfully!' AS status;
