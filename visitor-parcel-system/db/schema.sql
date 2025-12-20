CREATE DATABASE IF NOT EXISTS visitor_system;
USE visitor_system;

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Resident', 'Security', 'Admin') DEFAULT 'Resident',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  security_guard_id INT,
  type ENUM('Visitor', 'Parcel') NOT NULL,
  status VARCHAR(50) DEFAULT 'WaitingForApproval',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES user(id),
  FOREIGN KEY (security_guard_id) REFERENCES user(id)
);
