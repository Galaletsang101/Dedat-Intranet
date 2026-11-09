# DEDaT Intranet

An internal staff portal built with React and Vite, an Express API, and PostgreSQL. The frontend is in the repository root; the API and database setup files are in `backend`.

The main libraries are React 19, Vite 8, Express 5, and the Node PostgreSQL client (`pg`).

## Requirements

- Windows, macOS, or Linux
- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite 8 release)
- npm
- PostgreSQL and, for the command-line setup below, the PostgreSQL `psql` tools

## Local setup

### 1. Install dependencies

From the project root:

```powershell
npm install
Set-Location .\backend
npm install
Set-Location ..
```

### 2. Create and configure the database

Create a PostgreSQL database:

```powershell
createdb -U postgres dedat_intranet
```

If `createdb` is not on your PATH, create a database named `dedat_intranet` in pgAdmin instead.

Copy the backend environment template and edit it with the PostgreSQL username and password you chose:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

The backend reads `backend/.env` when started from the `backend` directory. Do not commit this file or put database credentials in frontend environment variables.

Create the tables expected by the API:

```powershell
Set-Location .\backend
psql -U postgres -d dedat_intranet -f .\database\schema.sql
```

Alternatively, open `backend/database/schema.sql` in pgAdmin's Query Tool and execute it against `dedat_intranet`.

The registration endpoint only accepts staff already present in the `employees` table. To load the sample staff directory into that table, run this once after applying the schema:

```powershell
npm run import:employees
```

### 3. Start the API

In a PowerShell terminal:

```powershell
Set-Location .\backend
npm start
```

The API listens on `http://localhost:5000`. Check that it is running at `http://localhost:5000/`.

### 4. Start the frontend

Open a second PowerShell terminal from the project root:

```powershell
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Keep both terminals running while using the app.

## Configuration

`backend/.env.example` lists the database settings used by the API:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` for signing login tokens
- `DB_SSL` to enable SSL when required by your hosted PostgreSQL provider

The frontend's service modules default to `http://localhost:5000/api`; several pages also use this URL directly. Some service modules support `VITE_API_URL`, but not every page uses that setting. If you change the API host or port, update all frontend API references consistently.

## Useful commands

Run these from the project root unless noted:

```powershell
npm run dev       # frontend development server
npm run build     # production frontend build
npm run deploy    # publish the built frontend to GitHub Pages
```

From `backend`:

```powershell
npm start                    # start the Express API
npm run import:employees     # load staff directory records
```

## Current limitations and issues

- `npm run build` succeeds. Vite reports that the minified JavaScript chunk is over 500 kB; consider code-splitting to reduce initial download size.
- There is no configured automated test suite. The backend's `npm test` command currently exits with “Error: no test specified.”
- Running `npm exec eslint -- .` currently fails with 110 errors and 1 warning, including unused imports/variables and Node globals not configured for backend files.
- The latest dependency installs reported npm audit advisories (14 at the project root and 3 in `backend`). Review with `npm audit` in each directory before deployment.
- The frontend deploy command only publishes the static frontend. The Express API and PostgreSQL database must be hosted separately; the local API URL defaults will not work for a deployed site.
- Password reset is not implemented. Some content services also use browser local storage as a fallback, so not every feature necessarily reads/writes PostgreSQL in every failure case.
- The backend routes do not all enforce authentication/authorization. Review and secure the API before exposing it beyond a trusted development environment.
- A second API exists at the repository root (`server.js`, port 3001) and only handles news. Use `backend/server.js` for the frontend, which expects the API on port 5000.

## Database notes

`backend/database/schema.sql` creates the tables used by the API: `employees`, `users`, `news`, `wellness_videos`, `calendar_events`, `documents`, `policies`, `faqs`, and `circulus`. It can be safely re-run to create any missing tables. The employee import script skips IDs that are already present.

Back up the PostgreSQL database before making schema or data changes. Keep `.env` credentials private and use a strong, unique `JWT_SECRET`.
