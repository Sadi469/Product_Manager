-- Simple Product Management System
-- CSE-223 Database Management System Project
-- Run this in phpMyAdmin or the MySQL CLI before starting the server

CREATE DATABASE IF NOT EXISTS product_management_db;
USE product_management_db;

-- Products table (matches the Database Design section of the proposal)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table for the login page
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTE: we don't insert the default admin user here because the password
-- needs to be bcrypt-hashed. The server automatically creates a default
-- admin account (username: admin, password: admin123) the first time it
-- starts up and finds the users table empty. See server.js.

-- Sample products so the dashboard isn't empty on first run
INSERT INTO products (name, price, quantity) VALUES
('Wireless Mouse', 650.00, 40),
('Mechanical Keyboard', 2450.00, 15),
('USB-C Hub', 1200.00, 25),
('HD Webcam', 1800.00, 10);
