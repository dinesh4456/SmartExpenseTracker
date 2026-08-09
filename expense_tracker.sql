-- =========================================================
-- Smart Expense Tracker Database Schema
-- Database: expense_tracker
-- Compatible with MySQL 8.x, MariaDB, Railway MySQL, Aiven, Neon
-- =========================================================

CREATE DATABASE IF NOT EXISTS expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expense_tracker;

-- ---------------------------------------------------------
-- Table structure for `users`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'USER',
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `monthly_savings_target` DECIMAL(15,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `categories`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'EXPENSE',
  `description` VARCHAR(255) DEFAULT NULL,
  `user_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categories_user` (`user_id`),
  CONSTRAINT `fk_categories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `expenses`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `title` VARCHAR(150) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `expense_date` DATE NOT NULL,
  `category_id` BIGINT DEFAULT NULL,
  `user_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_expenses_category` (`category_id`),
  KEY `fk_expenses_user` (`user_id`),
  CONSTRAINT `fk_expenses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_expenses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `income`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `income` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `source` VARCHAR(150) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `income_date` DATE NOT NULL,
  `user_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_income_user` (`user_id`),
  CONSTRAINT `fk_income_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `budgets`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `budgets` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `month` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `user_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_budgets_user_month_year` (`user_id`, `month`, `year`),
  CONSTRAINT `fk_budgets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Sample Default Global Categories (user_id is NULL for system default)
-- ---------------------------------------------------------
INSERT IGNORE INTO `categories` (`id`, `name`, `type`, `description`, `user_id`) VALUES
(1, 'Education', 'EXPENSE', 'Tuition fees, books, courses, and learning materials', NULL),
(2, 'Transportation', 'EXPENSE', 'Fuel, cab, public transit, and vehicle maintenance', NULL),
(3, 'Housing & Rent', 'EXPENSE', 'Rent, mortgage, and home maintenance', NULL),
(4, 'Utilities', 'EXPENSE', 'Electricity, water, gas, internet, and mobile recharges', NULL),
(5, 'Entertainment', 'EXPENSE', 'Movies, streaming services, and outings', NULL),
(6, 'Shopping', 'EXPENSE', 'Clothing, gadgets, and personal shopping', NULL),
(7, 'Health & Medical', 'EXPENSE', 'Doctor visits, pharmacy, insurance, and gym', NULL),
(8, 'Salary', 'INCOME', 'Monthly primary job salary', NULL),
(9, 'Freelancing', 'INCOME', 'Consulting and freelance earnings', NULL),
(10, 'Investments', 'INCOME', 'Dividends, stocks, and crypto returns', NULL);
