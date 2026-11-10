# Installation Guide

Complete setup from a blank Windows development machine. Assumes no
prior work on this project. Commands are given for Windows (PowerShell);
macOS/Linux users can substitute the equivalent shell commands — the
`npm`/`psql` commands themselves are identical.

## 1. Required software

| Tool | Minimum version | Why |
|---|---|---|
| Node.js | A recent LTS (v18+; v24 was used in development) | Runs both the frontend build and the backend |
| npm | Comes with Node.js | Package management |
| PostgreSQL | 14+ (18.6 used in development) | The application's database |
| Git | Any recent version | Cloning the repository |
| A code editor | — | VS Code is a reasonable default, not required |

## 2. Install Node.js and npm

Download the installer from [nodejs.org](https://nodejs.org) (choose the
LTS version) and run it — npm is bundled. Verify:

```powershell
node --version
npm --version
```

## 3. Install PostgreSQL

Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
and run the installer. During setup you'll be asked to set a password
for the `postgres` superuser — remember it, you'll need it for
`DB_PASSWORD` later. The installer also offers to install
**pgAdmin** (a GUI) and **Stack Builder** — neither is required for this
project, but pgAdmin is convenient for browsing the database visually.

### Configuring PostgreSQL's PATH on Windows

The installer usually adds PostgreSQL's `bin` directory to your PATH
automatically. Verify:

```powershell
psql --version
```

If that fails with `'psql' is not recognized...`, add it manually:

1. Find your install directory — typically
   `C:\Program Files\PostgreSQL\<version>\bin`.
2. Open **System Properties → Environment Variables → System variables →
   Path → Edit → New**, and add that path.
3. Close and reopen your terminal, then retry `psql --version`.

## 4. Get the project source code

```powershell
git clone <repository-url>
cd Dedat-Intranet
```

(Replace `<repository-url>` with wherever this repository is actually
hosted for your organization — not documented here since it isn't part
of the codebase itself.)

## 5. Understand the repository layout before going further

Two independent npm projects live in this one repository:

- The **frontend** (`package.json` at the repo root) — a Vite/React app.
- The **backend** (`backend/package.json`) — an Express API.

They're installed, run, and tested separately — every command below says
which directory to run it from.

## 6. Install frontend dependencies

From the repository root:

```powershell
npm install
```

## 7. Install backend dependencies

```powershell
cd backend
npm install
cd ..
```

## 8. Configure environment variables

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` in your editor and fill in real values:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dedat_intranet
DB_USER=postgres
DB_PASSWORD=<the password you set when installing PostgreSQL>
DB_SSL=false
JWT_SECRET=<any long random string - e.g. generate one with the command below>
EMAIL_USER=
EMAIL_PASSWORD=
```

Generate a random `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`EMAIL_USER`/`EMAIL_PASSWORD` can be left blank for local development —
see [`../technical/INTEGRATIONS.md`](../technical/INTEGRATIONS.md) §1 for
what that means (reset links print to the console instead of emailing).

The root `.env` only needs `VITE_API_URL` if you're pointing the frontend
at a backend that isn't `http://localhost:5000` — leave it unset
otherwise.

## 9. Create the PostgreSQL database

```powershell
psql -U postgres -c "CREATE DATABASE dedat_intranet;"
```

You'll be prompted for the `postgres` password you set during
installation.

## 10. Run the SQL schema file

```powershell
psql -U postgres -d dedat_intranet -f backend\database\schema.sql
```

This creates the base tables (`employees`, `news`, `wellness_videos`,
etc.) as they existed before any of this project's migrations.

## 11. Apply migrations

```powershell
cd backend
npm run migrate
```

Expect output listing each of the 6 migration files as `Applying:` —
these add the Admin role system, department management, password-reset
tokens, and the News/Wellness Draft/Published workflow. Safe to re-run
at any time; already-applied migrations are skipped.

## 12. Import employee data

```powershell
npm run import:employees
npm run migrate:employee-profiles
```

The first loads the 159 records from `src/components/staff/staffData.js`
into the `employees` table. The second backfills their richer profile
fields (skills, mentor flag, phone, location, experience). Both are
safe to re-run — neither creates duplicates.

## 13. Provision the Admin account

```powershell
npm run provision:admin -- ungomane@ncdedat.gov.za
```

If that account already has a `users` row (most likely, if it
self-registered previously), this simply updates its role to `Admin`. If
not, it creates one and prints a one-time password-set link instead of
inventing a password — open that link in the running app once it's up.

## 14. Start the backend

```powershell
npm start
```

Expect to see:
```
DEDAT backend running on http://localhost:5000
Connected to PostgreSQL
```

Leave this terminal running.

## 15. Start the frontend

In a **new** terminal, from the repository root:

```powershell
npm run dev
```

Expect output giving a local URL, typically `http://localhost:5173`
(Vite picks the next free port if 5173 is taken — read the actual
output). Open that URL in a browser.

## 16. Test the database connection

Already implicitly verified by step 14's "Connected to PostgreSQL"
message. To check explicitly:

```powershell
psql -U postgres -d dedat_intranet -c "SELECT COUNT(*) FROM employees;"
```

Expect `159` (or your organization's actual employee count, if you've
customized the data).

## 17. Test an API endpoint directly

```powershell
curl http://localhost:5000/
```

Expect `{"message":"DEDAT Intranet Backend is running"}`.

## 18. Log into the application

Open the frontend URL from step 15, and log in as
`ungomane@ncdedat.gov.za` with whatever password that account currently
has (if you don't know it, use **Forgot Password** on the login screen —
with `EMAIL_USER`/`EMAIL_PASSWORD` unset, the reset link will be printed
to the backend's terminal instead of emailed).

## 19. Verify the Admin account

After logging in, confirm **Admin Center** appears in the top navigation
bar. Click into it — Overview should show real stats (159 active
employees, 6 departments, etc.).

## 20. You're running the application locally

Both servers need to stay running in their own terminals while you work.
Stop either with Ctrl+C.

---

## Troubleshooting common setup errors

| Symptom | Likely cause | Fix |
|---|---|---|
| `'psql' is not recognized as an internal or external command` | PostgreSQL's `bin` directory isn't on PATH | See §3 above |
| `password authentication failed for user "postgres"` | Wrong `DB_PASSWORD` in `backend\.env`, or it doesn't match what you set during PostgreSQL install | Reset the `postgres` user's password with `ALTER USER postgres WITH PASSWORD 'newpassword';` via `psql`, then update `.env` to match |
| `database "dedat_intranet" does not exist` | Step 9 was skipped or targeted a different database name | Re-run step 9; confirm `DB_NAME` in `.env` matches exactly |
| Backend logs `DB_PASSWORD loaded: false` | `backend\.env` wasn't found or `DB_PASSWORD` line is missing/misspelled | Confirm the file is named exactly `backend\.env` (not `.env.example`) and the variable name is spelled correctly |
| `Error: Cannot find module...` on `npm start`/`npm run dev` | Dependencies weren't installed, or installed in the wrong directory | Re-run `npm install` from the correct directory (repo root for frontend, `backend/` for backend) |
| Frontend loads but every page shows a loading spinner forever / network errors in the browser console | Backend isn't running, or is running on a different port than the frontend expects | Confirm `npm start` is running in `backend/` and shows "running on http://localhost:5000"; check `VITE_API_URL` in the root `.env` isn't pointing elsewhere |
| `npm run migrate` reports an error partway through | A migration failed - check the console output for the specific SQL error | Each migration runs inside a transaction and rolls back on failure, so partial application shouldn't happen; fix the underlying issue (e.g. a permissions problem) and re-run — already-applied migrations will be skipped |
| Login succeeds but no **Admin Center** link appears | The account's role isn't actually `Admin` in the database yet | Re-run step 13; confirm with `psql -U postgres -d dedat_intranet -c "SELECT email, role FROM users;"` |
| `EADDRINUSE` on backend start | Something else (maybe a previous `node server.js` that didn't exit) is already using port 5000 | Find and stop it: `netstat -ano \| findstr :5000`, then `taskkill /PID <pid> /F` |

For issues not covered here, see
[`../support/TROUBLESHOOTING.md`](../support/TROUBLESHOOTING.md), which
covers problems beyond initial setup (date bugs, video playback, Admin
login/authorization failures, build failures).
