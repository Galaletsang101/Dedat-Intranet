# Troubleshooting Guide

Each entry: **Symptoms → Root cause → Diagnose → Fix → Verify.** Setup-time
issues (PostgreSQL PATH, missing npm scripts) are also covered in
[`../guides/INSTALLATION_GUIDE.md`](../guides/INSTALLATION_GUIDE.md)'s
own troubleshooting section — this file goes deeper and covers
post-setup issues too.

## PostgreSQL installation / PATH problems

**Symptoms:** `'psql' is not recognized as an internal or external
command`.

**Root cause:** the PostgreSQL installer's `bin` directory isn't on the
system `PATH`.

**Diagnose:**
```powershell
Test-Path "C:\Program Files\PostgreSQL\18\bin\psql.exe"
```

**Fix:** add that directory to `PATH` via System Properties →
Environment Variables (see
[`../guides/INSTALLATION_GUIDE.md`](../guides/INSTALLATION_GUIDE.md) §3),
then open a **new** terminal.

**Verify:** `psql --version` prints a version number.

---

## Password authentication failures

**Symptoms:** `password authentication failed for user "postgres"`, or
the backend logs `DB_PASSWORD loaded: true` but still fails to connect.

**Root cause:** `backend\.env`'s `DB_PASSWORD` doesn't match the
`postgres` user's actual password.

**Diagnose:**
```powershell
psql -U postgres -c "SELECT 1;"   # prompts for password - try the one in .env
```

**Fix:** either re-enter the correct password in `backend\.env`, or
reset it:
```powershell
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'newpassword';"
```
then update `backend\.env` to match.

**Verify:** backend startup log shows `Connected to PostgreSQL` with no
following error.

---

## Database connection failures (backend won't start / crashes)

**Symptoms:** backend process exits immediately, or every API call
returns a 500 with a database-related error in the console.

**Root cause:** usually one of — PostgreSQL service not running, wrong
`DB_HOST`/`DB_PORT`/`DB_NAME`, or the database doesn't exist yet.

**Diagnose:**
```powershell
Get-Service postgresql*          # confirm the service is Running
psql -U postgres -l              # list databases - confirm dedat_intranet exists
```

**Fix:** start the service if stopped
(`Start-Service postgresql-x64-18`, adjusting the service name), create
the database if missing (`CREATE DATABASE dedat_intranet;`), correct
`backend\.env` if the host/port/name are wrong.

**Verify:** `npm start` (from `backend/`) logs `Connected to PostgreSQL`.

---

## Missing schema / missing tables

**Symptoms:** backend starts, but any query fails with
`relation "employees" does not exist` (or similar).

**Root cause:** `backend/database/schema.sql` was never applied to this
database.

**Diagnose:**
```powershell
psql -U postgres -d dedat_intranet -c "\dt"
```
If this lists no tables (or far fewer than 12), the schema wasn't run.

**Fix:**
```powershell
psql -U postgres -d dedat_intranet -f backend\database\schema.sql
cd backend
npm run migrate
```

**Verify:** `\dt` now lists 12 tables (see
[`../technical/DATABASE_DOCUMENTATION.md`](../technical/DATABASE_DOCUMENTATION.md)).

---

## "Missing npm script" errors

**Symptoms:** `npm ERR! Missing script: "migrate"` (or similar) when
running a documented command.

**Root cause:** the command was run from the wrong directory — several
scripts (`migrate`, `provision:admin`, `import:employees`,
`migrate:employee-profiles`) only exist in `backend/package.json`, not
the root one.

**Diagnose:** `pwd` / `Get-Location` — confirm you're in `backend/` for
any backend-only script.

**Fix:** `cd backend` first, or `cd ..` if you're in the wrong direction
for a frontend script (`dev`, `build`, `deploy`).

---

## Employee import failures

**Symptoms:** `npm run import:employees` errors, or reports 0 imported.

**Root cause:** either the schema wasn't applied yet (see above), or
`src/components/staff/staffData.js` doesn't match the expected export
shape (`export const staffData = [...]`) if it's been edited.

**Diagnose:** check the script's console output — it logs
`Found N employees` before inserting; if `N` is 0, the file's export
format changed.

**Fix:** ensure the schema/migrations are applied first; if the data
file's shape changed, `backend/importEmployees.js` and
`backend/scripts/migrateEmployeeProfiles.js` both parse it via a regex
match on `(?:const|let|var)\s+staffData\s*=\s*(\[[\s\S]*\])` — a
structural change to the export (not just data values) will break this
and needs the parser updated to match.

**Verify:** `psql -U postgres -d dedat_intranet -c "SELECT COUNT(*) FROM employees;"` returns 159 (or re-run and confirm the "Imported: N" count is sensible).

---

## Environment configuration problems

**Symptoms:** backend logs show `DB_PASSWORD loaded: false`, or the
frontend can't reach the backend at all.

**Root cause:** `.env` file missing, misnamed, or a variable misspelled.

**Diagnose:**
```powershell
Test-Path backend\.env
Get-Content backend\.env
```

**Fix:** confirm the file is literally named `.env` (not `.env.example`
or `.env.txt`), in `backend/`, with correctly-spelled variable names
matching [`../technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md) §7.

---

## "Invalid Date" errors

**Status: fixed, but documented here in case a regression is introduced.**

**Symptoms:** a date displays as the literal text "Invalid Date" anywhere
in the UI.

**Root cause (historical):** a component read a field name that didn't
match the API's actual response shape (e.g. `item.publish_date` when the
real field was `publication_date`), and called
`.toLocaleDateString()` on the resulting `Invalid Date` object with no
validity check.

**Diagnose:** search the offending component for any `new Date(`
call that **isn't** going through `src/utils/dateUtils.js`.

**Fix:** never format a date inline — import and use `formatDate` /
`formatDateTime` / `formatRelative` from `src/utils/dateUtils.js`, which
can never return "Invalid Date" (verified by
`src/utils/dateUtils.test.js`). If you've added a new date-bearing field,
confirm it's actually named what you think it's named by checking the
real API response (`curl` the endpoint, or check
[`../technical/API_DOCUMENTATION.md`](../technical/API_DOCUMENTATION.md))
rather than assuming.

**Verify:** `npm test` (frontend) passes `dateUtils.test.js`; manually
check `document.body.innerText` on the affected page doesn't contain
"Invalid Date" (this is literally how it was verified during this
engagement — a scripted check across Homepage, News, the article page,
and Wellness).

---

## News article loading problems

**Symptoms:** a News article shows "Article not found" when it should
exist.

**Root cause:** either the id in the URL is wrong, or the article's
`status` is `Draft` and the viewer isn't logged in as an Admin (this is
intentional — see
[`../technical/AUTHENTICATION_AND_RBAC.md`](../technical/AUTHENTICATION_AND_RBAC.md)).

**Diagnose:**
```powershell
curl http://localhost:5000/api/news/<id>   # no auth - should 404 for a Draft
```
Then repeat with `-H "Authorization: Bearer <admin token>"` — if that
200s, the article exists and is correctly gated as a Draft.

**Fix:** either it's working as designed (publish the article), or the
id genuinely doesn't exist — check
`Admin Center → Add Content → News → Manage Existing Articles`.

---

## Wellness video playback issues

**Symptoms:** a video shows "This video couldn't be played" or a blank
player.

**Root cause:** usually one of — the `video_url` is genuinely broken
(deleted/moved source), the URL isn't actually a supported
YouTube/Vimeo/direct-file format, or (if it's an uploaded file) the
file is missing from `backend/uploads/videos/` (e.g. after a deployment
that didn't carry persistent storage forward — see
[`../guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md) §5).

**Diagnose:**
```powershell
# If it's an uploaded file - does it exist on disk?
Test-Path backend\uploads\videos\<filename-from-the-video_url>

# Is the URL reachable at all?
curl -I <the video_url value>
```

**Fix:** if the file is missing from disk but the database still
references it, either re-upload the video (Admin Center → Add Content →
Wellness → edit the item, replace the file) or restore it from a backup
(see [`BACKUP_AND_RECOVERY.md`](BACKUP_AND_RECOVERY.md)). If it's a
pasted link that's simply broken, edit the item with a working link.

**Verify:** the video plays in the Wellness page's player.

---

## Admin login and authorization failures

**Symptoms:** can't log in as an Admin, or logged in but **Admin
Center**/**Add Content** don't appear, or appear briefly then vanish.

**Diagnose (in order):**
```powershell
# 1. Does the account exist and have the Admin role in the database?
psql -U postgres -d dedat_intranet -c "SELECT email, role, is_active, must_reset_password FROM users WHERE email = 'ungomane@ncdedat.gov.za';"
```
- No row → the account was never provisioned; run
  `npm run provision:admin -- ungomane@ncdedat.gov.za`.
- `role` isn't `Admin` → same fix.
- `is_active` is `false` → reactivate via another Admin, or directly:
  `UPDATE users SET is_active = true WHERE email = '...';` (only as a
  last resort if no other Admin exists to do it through the UI).
- `must_reset_password` is `true` → the account needs to go through
  **Forgot Password** before it can log in at all.

```powershell
# 2. If the account IS correct, is the API actually enforcing it?
curl -i http://localhost:5000/api/admin/stats
# Expect 401 with no token
```
If this instead returns data, something is seriously wrong with the
auth middleware wiring — this should never happen; compare
`backend/server.js`'s route definitions against
[`../technical/AUTHENTICATION_AND_RBAC.md`](../technical/AUTHENTICATION_AND_RBAC.md)
§4 and re-run `backend/tests/middleware.auth.test.js`.

**Fix for the "appears then vanishes" variant specifically:** this was a
real, found-and-fixed bug — `ProtectedRoute`/`AdminRoute` needed
`useLocation()` added so they re-evaluate on every navigation. If you see
this again, confirm both guard components still call `useLocation()` (see
`src/routes/ProtectedRoute.jsx` / `AdminRoute.jsx`) — removing it would
reintroduce the issue.

**Verify:** log out and back in; **Admin Center** appears immediately and
stays visible across navigation.

---

## Frontend build failures

**Symptoms:** `npm run build` errors out.

**Diagnose:** read the actual Vite/esbuild error message — it almost
always names the specific file and import causing it (most commonly: a
typo'd import path, or a component exporting something a consumer
expects differently).

**Fix:** correct the named file. `npx eslint src` can also catch unused
imports and a handful of hook-rule violations before they become build
errors.

**Verify:** `npm run build` completes and reports a `dist/` output
summary with no errors (a warning about chunk size over 500kB is
expected and not a failure — see
[`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md) for
context).

---

## Backend startup errors

**Symptoms:** `node server.js` (or `npm start`) exits immediately with a
stack trace.

**Diagnose:** read the first few lines of the stack trace — common
causes are a missing `.env` (see "Environment configuration problems"
above), a port already in use, or a syntax error in a recently-edited
route.

**Port already in use:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <pid-from-above> /F
```

**Verify:** `npm start` logs `DEDAT backend running on
http://localhost:5000` and stays running.
