# Smart Expense Tracker - System Architecture

## 1. High-Level Architecture Overview

Smart Expense Tracker is a full-stack, enterprise-grade personal finance application built with a modern decoupled client-server architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│     React 19 + Vite + Bootstrap 5 + Chart.js + Recharts     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│               Spring Boot 3.x (Java 17)                     │
│                                                             │
│ ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐ │
│ │ Security Filter│ │ REST Controller│ │ Global Exception │ │
│ │  (JWT + CORS)  │ │     Layer      │ │     Handler      │ │
│ └───────┬────────┘ └───────┬────────┘ └──────────────────┘ │
│         │                  │                                │
│         ▼                  ▼                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                  Service / Business Logic               │ │
│ │ (Auth, Income, Expense, Budget, Reports, AI, Email, PDF)│ │
│ └──────────────────────────┬──────────────────────────────┘ │
│                            │                                │
│                            ▼                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                  Data Access (Spring Data JPA)          │ │
│ └──────────────────────────┬──────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────┘
                             │ JDBC / HikariCP Connection Pool
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                         │
│           MySQL 8.x / Railway / Aiven / Neon                │
└─────────────────────────────────────────────────────────────┘
```

## 2. Core Modules

### 2.1 Authentication & Security Module
- **JWT (JSON Web Token)**: Stateless authentication via `Authorization: Bearer <token>`.
- **Spring Security 6 Filter Chain**: Intercepts requests, validates signatures, and injects `UserDetails` into `SecurityContextHolder`.
- **CORS Configurator**: Manages cross-origin resource sharing for local and deployed environments.
- **BCrypt Password Encoder**: Irreversible cryptographic hashing for user credentials.

### 2.2 Financial Modules
- **Income Management**: Tracks revenue streams, sources, and dates.
- **Expense Management**: Categorizes expenditures, amounts, dates, and descriptions.
- **Category System**: Supports default global categories and user-defined custom categories.
- **Budget Tracking**: Monthly spending allocations with real-time percentage consumption calculations and limit threshold alerts.

### 2.3 Analytics & AI Insights
- **Heuristic Analytics Engine**: Computes savings rate, top expenditure categories, and month-over-month variances.
- **AI Recommendation Generation**: Dynamically constructs contextual tips and financial guidance.

### 2.4 Reporting & Export Engine
- **Apache POI**: Generates multi-column styled Microsoft Excel (.xlsx) financial reports.
- **iText / OpenPDF**: Assembles formatted PDF financial statements.
- **JavaMailSender (SMTP)**: Compiles monthly summary statements and delivers HTML/text reports via email.

## 3. Data Model

- **`users`**: User identity, hashed credentials, profile image path, and savings goals.
- **`categories`**: Category taxonomy (Food, Travel, Bills, etc.) mapped to income or expense types.
- **`income`**: Income transactions linked to users.
- **`expenses`**: Expense transactions linked to categories and users.
- **`budgets`**: Monthly budget targets partitioned by year and month per user.
