-- ========================================================
-- GhostWrite Database Schema (MySQL 8.0)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `ghostwrite_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ghostwrite_db`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `department` VARCHAR(100) NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL
) ENGINE=InnoDB;

-- Departments table
CREATE TABLE IF NOT EXISTS `departments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `contact_email` VARCHAR(150) NULL,
  `description` TEXT NULL
) ENGINE=InnoDB;

-- Issue Clusters table (Semantic grouping & duplicates)
CREATE TABLE IF NOT EXISTS `issue_clusters` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `cluster_code` VARCHAR(32) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `affected_area` VARCHAR(150) NULL,
  `report_count` INT DEFAULT 1,
  `severity` VARCHAR(20) DEFAULT 'HIGH',
  `status` VARCHAR(30) DEFAULT 'ACTIVE',
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL
) ENGINE=InnoDB;

-- Anonymous Reports table (Zero Identity Logging)
CREATE TABLE IF NOT EXISTS `anonymous_reports` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` VARCHAR(32) NOT NULL UNIQUE,
  `tracking_token_hash` VARCHAR(128) NOT NULL,
  `reporter_type` VARCHAR(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `subcategory` VARCHAR(50) NULL,
  `severity` VARCHAR(20) NOT NULL,
  `priority` VARCHAR(10) NOT NULL,
  `status` VARCHAR(30) NOT NULL,
  `department` VARCHAR(100) NULL,
  `assigned_to` VARCHAR(120) NULL,
  `raw_description` LONGTEXT NOT NULL,
  `incident_date` VARCHAR(50) NULL,
  `location` VARCHAR(150) NULL,
  `related_authority` VARCHAR(150) NULL,
  `additional_notes` TEXT NULL,
  `authority_response` TEXT NULL,
  `resolution_notes` TEXT NULL,
  `cluster_id` BIGINT NULL,
  `escalated_at` DATETIME(6) NULL,
  `is_confidential_contact_provided` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  INDEX idx_report_id (`report_id`),
  INDEX idx_status (`status`),
  INDEX idx_category (`category`),
  INDEX idx_department (`department`),
  INDEX idx_priority (`priority`)
) ENGINE=InnoDB;

-- AI Ghostwritten Documents table
CREATE TABLE IF NOT EXISTS `ghost_written_documents` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` BIGINT NOT NULL UNIQUE,
  `professional_title` VARCHAR(255) NOT NULL,
  `executive_summary` TEXT NULL,
  `detailed_description` LONGTEXT NULL,
  `relevant_context` TEXT NULL,
  `impact` TEXT NULL,
  `requested_action` TEXT NULL,
  `suggested_priority` VARCHAR(20) NULL,
  `suggested_department` VARCHAR(100) NULL,
  `professional_closing` TEXT NULL,
  `document_status` VARCHAR(30) DEFAULT 'GENERATED',
  `edited_by_reviewer` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  FOREIGN KEY (`report_id`) REFERENCES `anonymous_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- AI Analytical Assessments table
CREATE TABLE IF NOT EXISTS `ai_analyses` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` BIGINT NOT NULL UNIQUE,
  `predicted_category` VARCHAR(60) NULL,
  `predicted_subcategory` VARCHAR(60) NULL,
  `predicted_severity` VARCHAR(20) NULL,
  `predicted_priority` VARCHAR(10) NULL,
  `recommended_department` VARCHAR(100) NULL,
  `reasoning_rationale` TEXT NULL,
  `sentiment_score` DOUBLE NULL,
  `emotion_tone` VARCHAR(50) NULL,
  `risk_level` VARCHAR(20) NULL,
  `duplicate_confidence` DOUBLE NULL,
  `extracted_keywords` TEXT NULL,
  `risk_flags` TEXT NULL,
  `ai_confidence_score` DOUBLE DEFAULT 0.92,
  `created_at` DATETIME(6) NULL,
  FOREIGN KEY (`report_id`) REFERENCES `anonymous_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Anonymous Conversations table
CREATE TABLE IF NOT EXISTS `anonymous_conversations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` BIGINT NOT NULL UNIQUE,
  `is_locked` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  FOREIGN KEY (`report_id`) REFERENCES `anonymous_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Anonymous Messages table (Two-Way Chat)
CREATE TABLE IF NOT EXISTS `anonymous_messages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` BIGINT NOT NULL,
  `sender_type` VARCHAR(20) NOT NULL,
  `message_text` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(6) NULL,
  FOREIGN KEY (`conversation_id`) REFERENCES `anonymous_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Report Status History table (Audit timeline)
CREATE TABLE IF NOT EXISTS `report_status_histories` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` BIGINT NOT NULL,
  `old_status` VARCHAR(30) NULL,
  `new_status` VARCHAR(30) NOT NULL,
  `changed_by_role` VARCHAR(50) NULL,
  `changed_by_email` VARCHAR(120) NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME(6) NULL,
  FOREIGN KEY (`report_id`) REFERENCES `anonymous_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reporter Isolated Contacts (Privacy-preserving voluntary vault)
CREATE TABLE IF NOT EXISTS `reporter_isolated_contacts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` VARCHAR(32) NOT NULL UNIQUE,
  `encrypted_contact_email` VARCHAR(255) NULL,
  `encrypted_contact_phone` VARCHAR(100) NULL,
  `optional_note` TEXT NULL,
  `is_encrypted` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME(6) NULL,
  INDEX idx_contact_report_id (`report_id`)
) ENGINE=InnoDB;

-- Audit Logs table
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `target_report_id` VARCHAR(32) NULL,
  `performed_by_role` VARCHAR(50) NULL,
  `performed_by_user` VARCHAR(120) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` DATETIME(6) NULL,
  INDEX idx_audit_report_id (`target_report_id`),
  INDEX idx_audit_action (`action`)
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `recipient_role` VARCHAR(50) NULL,
  `recipient_department` VARCHAR(100) NULL,
  `recipient_email` VARCHAR(120) NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `report_id` VARCHAR(32) NULL,
  `notification_type` VARCHAR(50) NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(6) NULL
) ENGINE=InnoDB;
