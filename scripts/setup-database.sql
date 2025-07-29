-- Course Management Platform Database Setup Script

-- Create databases
CREATE DATABASE IF NOT EXISTS course_management;

-- Use the main database
USE course_management;

-- Show created databases
SHOW DATABASES LIKE 'course_management%';

-- Success message
SELECT 'Database setup completed successfully!' AS status;
