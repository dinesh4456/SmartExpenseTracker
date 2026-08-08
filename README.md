# 💰 Smart Expense Tracker

> An intelligent, full-stack personal finance and expense management platform built with **Spring Boot 3**, **React 19**, **MySQL**, and **JWT Security**.

---

## 🌟 Project Overview

**Smart Expense Tracker** empowers individuals to take full control of their personal finances. With automated analytics, AI-powered financial suggestions, budget alerts, real-time interactive charts, and export capabilities (Excel, PDF, and automated Email reports), it transforms everyday expense tracking into actionable wealth-building insights.

---

## ✨ Features

- 🔐 **Authentication & Security**
  - Secure User Registration & Login with **JWT (JSON Web Tokens)**
  - Stateless Spring Security architecture with BCrypt encrypted passwords
  - Forgot password & Profile management
- 📊 **Interactive Dashboard**
  - Real-time income, expense, and net balance calculation
  - Dynamic monthly trend charts and category breakdown charts
  - Recent transactions overview and rapid action shortcuts
- 💸 **Income & Expense Tracking**
  - Comprehensive CRUD operations for income and expenses
  - Date filtering, search, and category tagging
- 🎯 **Budget Management & Alerts**
  - Monthly budget limit allocations
  - Visual progress bars and overspending warnings
- 🏷️ **Smart Categorization**
  - Default global categories + customizable user-defined categories
  - Separate categorization for income and expense streams
- 🤖 **AI-Powered Suggestions**
  - Dynamic financial advice based on savings rate and spending velocity
  - Identification of top spending categories and month-over-month variances
- 📄 **Reports & Multi-Format Exports**
  - Filter reports by year and month
  - **Excel Export (.xlsx)** with multi-column financial summaries via Apache POI
  - **PDF Export (.pdf)** formatted statements via OpenPDF/iText
  - **Email Financial Reports** directly to your inbox via SMTP
- 📱 **Modern & Responsive UI**
  - Polished dark/light aesthetic with micro-interactions
  - Fully responsive across mobile, tablet, and desktop screens

---

## 📸 Screenshots

| Feature | Preview |
|---|---|
| **Dashboard** | ![Dashboard](screenshots/dashboard.png) |
| **Expenses Module** | ![Expenses](screenshots/expense.png) |
| **AI Suggestions** | ![AI Insights](screenshots/ai.png) |
| **Authentication** | ![Login](screenshots/login.png) |

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security 6 + JJWT (Stateless JWT Authentication)
- **Database Access**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x (compatible with PostgreSQL / MariaDB / Railway / Aiven)
- **Exports & Mail**: Apache POI (Excel), OpenPDF / iText (PDF), Spring Mail (JavaMailSender)
- **Documentation**: Swagger OpenAPI 3.0 (`springdoc-openapi`)

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Bootstrap 5 + CSS3 + React Icons
- **Visualizations**: Chart.js, React-ChartJS-2, Recharts
- **HTTP Client**: Axios (with centralized JWT interceptor)
- **Routing**: React Router v7 with Protected Route Guards

---

## 🚀 Getting Started (Zero-Config Setup)

### 1. Database Setup

1. Make sure **MySQL** is installed and running.
2. Import the provided schema:
   ```bash
   mysql -u root -p < expense_tracker.sql
   ```
   *(Or import `expense_tracker.sql` using MySQL Workbench / phpMyAdmin)*

---

### 2. Backend Setup & Run

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. (Optional) Set environment variables in `.env` or run directly with defaults:
   ```bash
   ./mvnw clean spring-boot:run
   ```
   *Or build package:*
   ```bash
   ./mvnw clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```
3. The backend will start on `http://localhost:8080`.
4. Access interactive **Swagger API Docs**: `http://localhost:8080/swagger-ui/index.html`

---

### 3. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables Reference

### Backend Configuration (`backend/application.yml` or Environment)

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/expense_tracker?...` | Database JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(empty)* | Database password |
| `JWT_SECRET` | `YmFja2VuZHNtYXJ0ZXhwZW5zZXRy...` | 256-bit Base64 secret key |
| `JWT_EXPIRATION` | `86400000` (24h in ms) | JWT token expiration duration |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP Host |
| `MAIL_PORT` | `587` | SMTP Port |
| `MAIL_USERNAME` | *(optional)* | SMTP Username |
| `MAIL_PASSWORD` | *(optional)* | SMTP App Password |
| `PORT` | `8080` | Backend Server Port |

### Frontend Configuration (`frontend/.env`)

| Variable | Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend REST API Base URL |

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push project to GitHub.
2. Link repository in **Vercel** or **Netlify**.
3. Set **Root Directory**: `frontend`.
4. Set **Build Command**: `npm run build`.
5. Set **Output Directory**: `dist`.
6. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-domain.onrender.com/api`

### Backend Deployment (Render / Railway)
1. In **Render** or **Railway**, create a new Web Service pointing to `backend`.
2. Set Build Command: `./mvnw clean package -DskipTests`.
3. Set Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`.
4. Configure Environment Variables:
   - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
   - `MAIL_USERNAME`, `MAIL_PASSWORD`

### Cloud Database (Railway MySQL / Aiven / PlanetScale)
1. Provision a free MySQL database instance on **Railway** or **Aiven**.
2. Run `expense_tracker.sql` on the cloud instance.
3. Pass the cloud connection string to the backend service.

---

## 🔮 Future Enhancements

- 💳 Multi-Currency & Real-Time Exchange Rate support
- 🧾 OCR Receipt Scanning with automated transaction extraction
- 📱 Progressive Web App (PWA) offline sync
- 👥 Shared group wallets & split-expense calculations

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
