# Smart Expense Tracker - REST API Documentation

Base URL: `http://localhost:8080/api` (Development) or your production domain.
Swagger UI: `http://localhost:8080/swagger-ui/index.html`
OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## 1. Authentication APIs (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user and return JWT | No |
| `POST` | `/api/auth/forgot-password` | Send password reset instructions | No |

---

## 2. Dashboard APIs (`/api/dashboard`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Get aggregated income, expense, balance | Yes |
| `GET` | `/api/dashboard/recent-transactions` | Get recent transactions (params: `limit`, `days`) | Yes |

---

## 3. Expense APIs (`/api/expenses`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/expenses` | List all expenses for current user | Yes |
| `GET` | `/api/expenses/{id}` | Get expense by ID | Yes |
| `POST` | `/api/expenses` | Create new expense | Yes |
| `PUT` | `/api/expenses/{id}` | Update existing expense | Yes |
| `DELETE` | `/api/expenses/{id}` | Delete expense | Yes |

---

## 4. Income APIs (`/api/incomes` / `/api/income`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/incomes` | List all income entries | Yes |
| `POST` | `/api/incomes` | Record new income entry | Yes |
| `PUT` | `/api/incomes/{id}` | Update income entry | Yes |
| `DELETE` | `/api/incomes/{id}` | Delete income entry | Yes |

---

## 5. Budget APIs (`/api/budgets`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/budgets` | List all budget records | Yes |
| `POST` | `/api/budgets` | Set or update monthly budget | Yes |
| `DELETE` | `/api/budgets/{id}` | Remove budget limit | Yes |

---

## 6. Category APIs (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | Get all categories (system & user) | Yes |
| `POST` | `/api/categories` | Create custom category | Yes |
| `PUT` | `/api/categories/{id}` | Update category | Yes |
| `DELETE` | `/api/categories/{id}` | Delete custom category | Yes |

---

## 7. Reports & Export APIs (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/reports/monthly` | Get monthly analytics (params: `year`, `month`) | Yes |
| `GET` | `/api/reports/export/monthly-excel` | Download Excel (.xlsx) statement | Yes |
| `GET` | `/api/reports/export/monthly-pdf` | Download PDF statement | Yes |

---

## 8. AI Insights APIs (`/api/insights`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/insights` | Get AI summary, recommendations & metrics | Yes |

---

## 9. Email APIs (`/api/email`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/email/monthly-report` | Send monthly financial report to user's email | Yes |

---

## 10. User & Profile APIs (`/api/profile` & `/api/users`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/profile` | Get current user profile | Yes |
| `PUT` | `/api/profile` | Update profile information & password | Yes |
| `POST` | `/api/users/profile-image` | Upload profile avatar picture | Yes |
