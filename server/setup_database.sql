-- Teacher Panel Database Setup
-- This SQL file creates the database structure and initial data
-- Usage: mysql -u root -p < setup_database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS teacher_panel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, comment out if user exists)
-- CREATE USER IF NOT EXISTS 'teacher_panel_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON teacher_panel_db.* TO 'teacher_panel_user'@'localhost';
-- FLUSH PRIVILEGES;

USE teacher_panel_db;

-- Tables will be created automatically by Sequelize when you run the server
-- This file is a template for manual database setup if needed

-- After creating the database, run the seed script:
-- cd server
-- node scripts/seedDb.js
