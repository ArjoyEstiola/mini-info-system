-- database/schema.sql

CREATE DATABASE IF NOT EXISTS mini_info_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mini_info_system;

CREATE TABLE IF NOT EXISTS records (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  phone       VARCHAR(30)   NOT NULL DEFAULT '',
  department  VARCHAR(100)  NOT NULL DEFAULT '',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_records_name (name)
) ENGINE=InnoDB;

-- Optional sample data
INSERT INTO records (name, email, phone, department) VALUES
  ('Juan Dela Cruz', 'juan@example.com', '0917-123-4567', 'IT'),
  ('Maria Santos',    'maria@example.com', '0918-765-4321', 'HR');