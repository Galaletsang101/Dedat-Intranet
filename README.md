# DEDaT Intranet

Internal staff portal for the Northern Cape Department of Economic Development
and Tourism. React (Vite) frontend, Express backend, PostgreSQL database.

See [`docs/USER_FLOW_AND_ADMIN.md`](docs/USER_FLOW_AND_ADMIN.md) for the full
route/endpoint map and [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) for how
Admin access is configured, tested, and managed.

## Project layout

```
src/            React frontend (Vite, HashRouter)
backend/        Express API (port 5000) + PostgreSQL access
backend/database/migrations/   Versioned SQL migrations
backend/scripts/               One-off provisioning/maintenance scripts
```

## Setup

1. Copy environment files and fill in real values (never commit the filled-in
   files - they're already gitignored):
   ```
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
   Required backend variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
   `DB_PASSWORD`, `JWT_SECRET`. Optional: `EMAIL_USER` / `EMAIL_PASSWORD` (a
   Gmail account used to send password-reset/invite emails - without these,
   reset links are logged to the server console instead of emailed, which is
   fine for local development but must be set in any real deployment).

2. Install dependencies:
   ```
   npm install
   cd backend && npm install
   ```

3. Create the database schema, then apply migrations:
   ```
   psql -U postgres -d dedat_intranet -f backend/database/schema.sql
   cd backend && npm run migrate
   ```

4. Import the 159 employee records and backfill their directory profile
   fields (skills, mentor flag, phone, etc.) - safe to re-run, never creates
   duplicates:
   ```
   npm run import:employees
   npm run migrate:employee-profiles
   ```

5. Run the backend and frontend:
   ```
   cd backend && npm start     # http://localhost:5000
   npm run dev                 # http://localhost:5173 (or next free port)
   ```

## Admin access

The account `ungomane@ncdedat.gov.za` is provisioned as the permanent Admin
account. To (re-)apply that role after a fresh database setup:

```
cd backend
npm run provision:admin -- ungomane@ncdedat.gov.za
```

This is idempotent - safe to run any number of times. See
[`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) for the full explanation of how
roles are enforced and how to manage other users.

## Testing

```
cd backend && npm test   # Jest + Supertest - RBAC, auth, admin provisioning, news
npm test                 # Vitest - auth/session helpers, route guards, admin UI
```

## Admin Center

Admins (`role: 'Admin'`) see an **Admin Center** entry in the nav (`/#/admin`):
Overview (live stats), Employees, Users & Roles, Departments - all
database-backed with search/filter/pagination, confirmation dialogs, and
accessible modals. **Add Content** (`/#/add-content`) publishes News,
FAQs, Policies, Knowledge Centre resources, Wellness videos, and Calendar
events using a toolbar-based rich text editor (no raw Markdown shown).
Both are Admin-only, enforced on the backend independent of the frontend -
see [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md).

## Scripts reference (backend/)

| Script | Purpose |
|---|---|
| `npm start` | Run the API server |
| `npm run migrate` | Apply any pending SQL migrations |
| `npm run provision:admin -- <email>` | Grant the Admin role to an existing employee's account |
| `npm run import:employees` | Load `staffData.js` into the `employees` table |
| `npm run migrate:employee-profiles` | Backfill directory fields (skills, mentor, phone, etc.) from `staffData.js` |
| `npm test` | Run the backend test suite |
