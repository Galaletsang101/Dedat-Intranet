# Backend Documentation

## 1. Stack

Node.js + Express 5, `pg` (`node-postgres`) with raw parameterized SQL —
no ORM, no query builder. `bcryptjs` for password hashing, `jsonwebtoken`
for session tokens, `multer` for file uploads, `nodemailer` for
transactional email, `cors` + `express.json()` as the only global
middleware besides the static upload server.

## 2. Structure

```
backend/
├── server.js              All routes live here - not split into files (see §3)
├── db.js                  pg.Pool, reads DB_* env vars, logs connection status
├── middleware/
│   └── auth.js            authenticateToken, requireRole/requireAdmin
├── database/
│   ├── schema.sql          Base table definitions
│   └── migrations/         001-006, applied in filename order (see DATABASE_DOCUMENTATION.md)
├── scripts/
│   ├── migrate.js          Runs pending migrations, tracks them in schema_migrations
│   ├── setAdminRole.js     Promotes/provisions an Admin account by email
│   └── migrateEmployeeProfiles.js   Backfills employee profile fields from staffData.js
├── importEmployees.js      One-time: loads the 159 records from staffData.js into `employees`
├── tests/                  Jest + Supertest (see TESTING_GUIDE.md)
└── uploads/videos/         Admin-uploaded video files (gitignored, auto-created)
```

**`server.js` is intentionally one file**, not split into
`routes/`/`controllers/`/`services/` — every route handler is a direct
`app.get/post/put/delete(...)` call with its SQL inline. This is a
deliberate characteristic of the existing codebase (not something this
engagement changed) and is the single biggest thing to know before
navigating it: use the route table in
[`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) plus your editor's
search, not a folder structure, to find a given endpoint. At ~2,300
lines, this is the file most likely to need restructuring if the backend
grows significantly — see [`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md).

There is also a **second, legacy** `server.js` at the **repository root**
(not inside `backend/`) — an earlier/separate Express app on port 3001
with its own in-memory-fallback news CRUD. Nothing in `src/` calls port
3001; treat it as dead code unless something external still depends on
it.

## 3. Request lifecycle (typical write endpoint)

```
Request arrives
  → cors() / express.json()  (global)
  → authenticateToken          verifies JWT signature+expiry, sets req.user
  → requireAdmin (or requireRole(...))
      re-queries users.role/is_active fresh from PostgreSQL
  → route handler
      validates required fields (400 if missing)
      runs a parameterized pool.query(...)
      201/200 with the row, or a mapped error status
  → on any thrown error: caught, console.error'd, 500 { error: "..." }
```

Every `pool.query()` call uses `$1, $2, ...` placeholders with a values
array — no string-concatenated SQL anywhere, which is what prevents SQL
injection (see [`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md)
§Security for the one category of input that isn't separately
sanitized).

## 4. Middleware (`middleware/auth.js`)

Documented in full in
[`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md). Summary:
`authenticateToken` (verifies the token), `requireRole(...roles)` /
`requireAdmin` (re-checks the role against the database on every call).

## 5. File uploads

`multer.diskStorage` writes directly to `backend/uploads/videos/`, naming
each file `crypto.randomUUID() + original-extension` (never trusts the
client-supplied filename as-is, avoiding path traversal via a crafted
filename). `fileFilter` rejects anything whose MIME type doesn't start
with `video/`. `limits.fileSize` caps uploads at 200MB. The directory is
`fs.mkdirSync(..., { recursive: true })`'d at server startup, so it
always exists. Served back out via
`app.use("/uploads", express.static(UPLOADS_ROOT))` — a plain static file
server, no access control on reads (anyone with the URL can fetch the
video; URLs are UUIDs, not sequential, so they aren't guessable, but
this is "unlisted," not "authenticated").

## 6. Scripts (run from `backend/`)

| Command | What it does |
|---|---|
| `npm start` | Starts the API on port 5000 |
| `npm run migrate` | Applies any `database/migrations/*.sql` not yet in `schema_migrations` |
| `npm run provision:admin -- <email>` | Promotes an existing account to Admin, or provisions a new one from `employees` with a secure invite link |
| `npm run import:employees` | One-time load of the 159 `staffData.js` records into `employees` |
| `npm run migrate:employee-profiles` | Backfills skills/mentor/phone/location/experience from `staffData.js` onto existing `employees` rows |
| `npm test` | Runs the Jest/Supertest suite — see [`../support/TESTING_GUIDE.md`](../support/TESTING_GUIDE.md) |

`server.js` exports `module.exports = app` and only calls `app.listen()`
when run directly (`require.main === module`) — this is what lets the
test suite import the real app via Supertest without binding a port.

## 7. Environment variables (`backend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Yes | PostgreSQL connection (`db.js`) |
| `JWT_SECRET` | Yes | Signs/verifies login tokens |
| `EMAIL_USER`, `EMAIL_PASSWORD` | No | Gmail account for `nodemailer` — password-reset/invite emails. Without these, `sendAccountEmail()` logs the link to the console instead of sending it (safe fallback for local dev; must be set for any deployment where real email delivery matters) |

No other environment variables are read anywhere in the backend. The
frontend optionally reads `VITE_API_URL` (falls back to
`http://localhost:5000/api` if unset) — see `src/services/apiClient.js`.
