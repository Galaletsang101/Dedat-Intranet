# Maintenance Guide

Ongoing operational tasks once the system is running. For how to *build*
new features, see [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md); this guide
is about keeping an existing installation healthy.

## 1. Routine checks

| Task | How | Frequency (suggested) |
|---|---|---|
| Confirm both servers are running | `GET /` on the backend returns 200; the frontend loads | Whenever something seems down |
| Confirm the database is reachable | Backend startup log shows "Connected to PostgreSQL"; or `psql -U postgres -d dedat_intranet -c "SELECT 1;"` | Same |
| Check disk space for uploaded videos | `backend/uploads/videos/` grows unbounded — there's no automatic cleanup or quota | Monthly, or when uploads start failing |
| Review Admin accounts | `Admin Center → Users & Roles`, confirm more than one Admin exists | Quarterly |
| Check for pending employee registrations | `Admin Center → Overview` → "Pending Registrations" count | As needed |

## 2. Backups

No automated backup job exists in this project — see
[`../support/BACKUP_AND_RECOVERY.md`](../support/BACKUP_AND_RECOVERY.md)
for the manual `pg_dump` procedure. **Set up a scheduled backup** (cron,
Task Scheduler, or your hosting platform's managed-database backup
feature) as part of any real deployment — this is explicitly listed as
outstanding work in
[`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md).

Uploaded video files (`backend/uploads/videos/`) are **not** included in
a database backup — back up that directory separately if its contents
matter.

## 3. Applying updates / new code

```powershell
git pull
npm install                     # repo root - picks up any new frontend deps
cd backend
npm install                      # picks up any new backend deps
npm run migrate                  # applies any new migrations
cd ..
```

Then restart both the backend and frontend processes. Always re-run both
test suites after pulling changes, before trusting the update:

```powershell
cd backend && npm test
cd .. && npm test
```

## 4. Dependency updates

No automated tooling is configured (see
[`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) §7). When updating manually:

```powershell
npm outdated                 # repo root
cd backend && npm outdated
```

Update one package at a time where practical, re-running both test
suites and a manual smoke test (`npm run build`, login, Admin Center)
after each significant update — particularly for `express`,
`react-router-dom`, and `pg`, which are foundational to most of the
application's behavior.

## 5. Monitoring / error logging

Current state: plain `console.error(...)` in the backend, visible only
in whatever terminal/log file captures the Node process's output — no
log aggregation or alerting is configured. If this is deployed somewhere
persistent, redirect `stdout`/`stderr` to a log file (or your hosting
platform's log capture) at minimum, and consider a proper logging/error
tracking tool for anything beyond small-scale internal use.

## 6. Rotating secrets

`JWT_SECRET` (`backend/.env`): rotating it immediately invalidates every
currently-issued token — every logged-in user is signed out and must log
in again. There's no graceful dual-secret rollover mechanism; plan
rotations for low-usage periods.

`DB_PASSWORD`: update in `backend/.env` and in PostgreSQL
(`ALTER USER ... WITH PASSWORD ...`) together; restart the backend
afterward.

`EMAIL_PASSWORD` (Gmail App Password): regenerate via Google Account
settings if compromised or rotated on a schedule; update
`backend/.env` and restart the backend.

## 7. Database maintenance

- **Migrations** are the only sanctioned way to change the schema — see
  [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) §4. Never hand-edit a table
  in production without going through a migration file, or the
  `schema_migrations` tracking table will no longer reflect reality.
- **Soft-deleted rows** (`employees.status = 'Inactive'`,
  `departments.status = 'Inactive'`) are never automatically purged —
  they accumulate indefinitely by design (organizational history). If
  this becomes a real concern at scale, that's a deliberate future
  decision, not an oversight to "fix."
- **`password_reset_tokens`** accumulates one row per reset/invite
  request, including expired/used ones — there's no automatic cleanup.
  Harmless at small scale; a periodic `DELETE FROM
  password_reset_tokens WHERE expires_at < NOW() - INTERVAL '30 days'`
  is a reasonable housekeeping addition if the table grows large.

## 8. Adding a second (or third) Admin

Operationally important — see
[`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md) §7.
Have an existing Admin use **Admin Center → Users & Roles → Invite
User**, or run `npm run provision:admin -- <email>` on the server for an
existing account.

## 9. When something looks wrong

Start with [`../support/TROUBLESHOOTING.md`](../support/TROUBLESHOOTING.md)
— it covers the specific symptoms most likely to come up (date display
issues, video playback, login/authorization failures, build/startup
errors) with diagnostic commands and fixes.
