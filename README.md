# Expense Tracker

A full-stack Expense Tracker application built with React (Vite + Tailwind) for the frontend and Node.js + Express + PostgreSQL for the backend. This app allows users to add, view, and manage personal expenses with categories, descriptions, and dates.

## Features

- Add expenses with amount, category, description, and date
- Predefined categories: Food, Transport, Shopping, Entertainment, Bills, Other
- Add custom categories dynamically
- View all expenses sorted by date
- Validation for missing or invalid inputs
- Responsive and clean UI with Tailwind CSS
- Backend validation and database storage
- Fully parameterized SQL queries to prevent injection
- CI workflow for automated testing and builds (GitHub Actions)

## Tech Stack

**Frontend:**

- React 18 + Vite
- Tailwind CSS for styling
- Axios for API requests
- Components: ExpenseForm, ExpenseList

**Backend:**

- Node.js + Express
- PostgreSQL for database
- Routes: `/api/expenses` (GET and POST)
- Input validation and error handling

**Other:**

- GitHub Actions workflow for CI
# Expense Tracker

A full-stack Expense Tracker application built with React (Vite + Tailwind) for the frontend and Node.js + Express + PostgreSQL for the backend. The app lets users add, view, and manage personal expenses with categories, descriptions, and dates.

## Features

- Add expenses with amount, category, description, and date
- Predefined categories: Food, Transport, Shopping, Entertainment, Bills, Other
- Add custom categories dynamically
- View expenses sorted by date
- Frontend and backend validation
- Responsive UI using Tailwind CSS
- PostgreSQL storage with parameterized queries

## Tech Stack

- Frontend: React 18 + Vite, Tailwind CSS, Axios
- Backend: Node.js + Express, PostgreSQL (pg)
- CI: GitHub Actions (frontend build)

## Installation & Setup

1) Clone the repository

```bash
git clone https://github.com/Sub-47/ExpenseTracker.git
cd ExpenseTracker
```

2) Backend

```bash
cd backend
npm install
# create a .env file with your Postgres credentials; example:
# DB_USER=your_db_user
# DB_HOST=localhost
# DB_NAME=your_db_name
# DB_PASSWORD=your_password
# DB_PORT=5432
# PORT=5000

npm run dev   # starts server with nodemon (or use `npm start`)
```

The backend API will run on `http://localhost:5000` (by default).

3) Database

Create the required tables (example SQL is in `backend/database/schema.sql`). Example:

```sql
CREATE TABLE IF NOT EXISTS users(...);
CREATE TABLE IF NOT EXISTS expenses(...);
```

You can insert a test user if needed.

4) Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will start the dev server (default `http://localhost:5173`; if the port is in use, Vite will pick another port and print it to the terminal).

## Usage

- Open the frontend in your browser (the URL printed by Vite).
- Add a new expense using the form; the app posts to `http://localhost:5000/api/expenses`.
- The expenses list fetches from `GET /api/expenses/:userId` (frontend currently uses `userId = 1`).

## Project Structure

- backend/
  - `db.js` — PostgreSQL connection pool
  - `routes/expenses.js` — API routes
  - `server.js` — Express server
- frontend/
  - `src/main.jsx` — app entry
  - `src/components/ExpenseForm.jsx`
  - `src/components/ExpenseList.jsx`
  - `src/index.css` — Tailwind imports
  - `vite.config.js`, `tailwind.config.js`
- `.github/workflows/` — CI workflow

## Notes

- The frontend currently hardcodes `user_id = 1` for testing; adapt authentication/user management as needed.
