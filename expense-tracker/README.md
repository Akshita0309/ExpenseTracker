# Expense Tracker

Full-stack expense tracker built with **React**, **Spring Boot**, and **MySQL**.

Backend runs on **port 8081**, database name is **`expense_tracker`**.

## Features

- Income/expense CRUD with categories
- Dashboard with monthly summary and category breakdown chart
- Monthly reports with aggregation queries
- Budgets per category/month with automatic over-budget and 90%-used alerts
- A daily scheduled job (`@Scheduled`, 07:00) that re-checks every active budget
- PDF export and Excel export of a month's transactions
- JWT authentication (register/login, stateless, BCrypt password hashing)
- Bean validation + a global exception handler with consistent JSON error bodies
- Unit tests (JUnit 5 + Mockito) and an H2-backed Spring context test
- Docker Compose setup for MySQL + backend + frontend

## Project layout

```
backend/    Spring Boot 3 / Java 17 REST API
frontend/   React 18 (Create React App) single-page app
docker-compose.yml
```

## Running locally (without Docker)

### 1. Database

Create the database (or let Hibernate do it — the JDBC URL includes
`createDatabaseIfNotExist=true`):

```sql
CREATE DATABASE IF NOT EXISTS expense_tracker;
```

Create a `.env` file in the project root using the values from `.env.example`
and set the database and JWT secrets before starting the backend.

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8081**, all routes are under `/api`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The app runs on **http://localhost:3000** and talks to the API at
`http://localhost:8081/api` (see `REACT_APP_API_URL` in `.env` if you need to
override this).

## Running with Docker

```bash
cp .env.example .env   # optionally change MYSQL_ROOT_PASSWORD
docker compose up --build
```

- MySQL: `localhost:3306` (database `expense_tracker`)
- Backend API: `http://localhost:8081/api`
- Frontend: `http://localhost:3000`

## API overview

| Method              | Endpoint                    | Description                                                          |
| ------------------- | --------------------------- | -------------------------------------------------------------------- |
| POST                | `/api/auth/register`        | Create an account, returns JWT                                       |
| POST                | `/api/auth/login`           | Log in, returns JWT                                                  |
| GET/POST/PUT/DELETE | `/api/categories[/{id}]`    | Manage categories                                                    |
| GET/POST/PUT/DELETE | `/api/transactions[/{id}]`  | Manage transactions (filter by `startDate`, `endDate`, `categoryId`) |
| GET/POST/PUT/DELETE | `/api/budgets[/{id}]`       | Manage budgets (filter by `month`, `year`)                           |
| GET                 | `/api/alerts`               | List budget alerts                                                   |
| PATCH               | `/api/alerts/{id}/read`     | Mark an alert as read                                                |
| GET                 | `/api/reports/monthly`      | Income/expense/category summary                                      |
| GET                 | `/api/reports/export/pdf`   | Download month as PDF                                                |
| GET                 | `/api/reports/export/excel` | Download month as Excel                                              |

All routes except `/api/auth/**` require an `Authorization: Bearer <token>`
header.

## Tests

```bash
cd backend
mvn test
```
