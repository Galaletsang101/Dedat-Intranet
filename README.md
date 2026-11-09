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

All frontend API calls use `VITE_API_URL` when set, otherwise they use `http://localhost:5000/api`. Database credentials remain in the backend environment only.

## Website content administration

The existing **Add Content** page is available only to accounts with the `Admin` role. It can publish news, circulars, wellness videos, calendar events, policies, documents, FAQs, and website sections. The **Manage published content** panel provides create, edit, and delete operations for these records and the staff directory.

Employee content reads require a valid session token; admin collection APIs and all content writes require the `Admin` role. Read pages show database records, loading/empty states, and no demo-content fallback. To grant administrator access, update the existing account role in PostgreSQL; new registrations are assigned `Employee` by default.

`backend/database/schema.sql` adds the `site_content` table for pages/sections that do not have a dedicated existing table. Its `content` JSONB column holds section-specific collections (for example About page values, executive profiles, or homepage links). Re-run the schema script against an existing database to create this table and seed the existing 2026 public-holiday entries into `calendar_events` without duplicating them.

Document, policy, image, and video records currently store URLs. The project does not have a persistent file-upload service; selecting a local file only previews it in the current browser session.

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
- Password reset is not implemented. The primary API (`backend/server.js`, port 5000) is used by the frontend. The legacy root `server.js` API (port 3001) also reads PostgreSQL and requires administrator tokens for news writes; it is not used by the frontend.
- The database-backed About, Programmes, homepage, and dashboard sections are empty until administrators create their section records in the content manager.

## Database notes

`backend/database/schema.sql` creates the tables used by the API: `employees`, `users`, `news`, `wellness_videos`, `calendar_events`, `documents`, `policies`, `faqs`, `circulus`, and `site_content`. It can be safely re-run to create any missing tables and seed the 2026 holidays. The employee import script skips IDs that are already present.

Back up the PostgreSQL database before making schema or data changes. Keep `.env` credentials private and use a strong, unique `JWT_SECRET`.
