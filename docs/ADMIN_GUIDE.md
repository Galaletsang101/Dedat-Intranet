# Admin Access: Configuration, Enforcement, and Management

This document covers how `ungomane@ncdedat.gov.za` became the primary Admin
account, how the backend enforces that role, and how to manage other users
going forward. It supersedes the security caveats described in
[`USER_FLOW_AND_ADMIN.md`](USER_FLOW_AND_ADMIN.md)'s original §3.2 ("Admin is
UI-only") - that gap has been closed; see §2 below for the current model.

## 1. How the Admin account was configured

`ungomane@ncdedat.gov.za` already existed as a self-registered account
(`users.role = 'Employee'`) before this work began. It was promoted via:

```
cd backend
npm run provision:admin -- ungomane@ncdedat.gov.za
```

This runs `backend/scripts/setAdminRole.js`, which:

- Looks up the account by email.
- If a `users` row exists (it did), sets `role = 'Admin'` and
  `is_active = TRUE`. No other column (name, programme, password hash, etc.)
  is touched.
- If no `users` row existed, it would instead create one from the matching
  `employees` record with an unusable, randomly-generated placeholder
  password hash, set `must_reset_password = TRUE`, and issue a one-time
  password-set token - the account would be unusable until the person set
  their own password through `/#/reset-password?token=...`. **No password is
  ever invented or stored by an administrator.**
- Is idempotent: running it again on an already-Admin account is a no-op.

Login was verified end-to-end (automated, headless-browser test): the
account authenticates, receives `role: "Admin"` in both the JWT and the
returned user object, sees the "Admin Center" navigation entry, and can
load/use every admin screen with real data from PostgreSQL.

## 2. Authentication & authorization flow

```
Login (POST /api/auth/login)
  -> bcrypt.compare(password, users.password_hash)
  -> rejects if account is_active = FALSE or must_reset_password = TRUE
  -> JWT signed with { id, employee_id, email, role }, 8h expiry
  -> frontend stores { token, user } in sessionStorage

Every subsequent request to a protected endpoint:
  -> authenticateToken  (backend/middleware/auth.js)
       verifies JWT signature/expiry, attaches decoded claims to req.user
  -> requireRole(...roles) / requireAdmin
       re-reads the CURRENT role and is_active flag from PostgreSQL
       (does NOT trust the role embedded in the JWT)
       403s immediately if the role doesn't match or the account is deactivated
```

**Why re-check the database instead of trusting the JWT's role claim?** A
JWT is valid for 8 hours. If an Admin demotes a user (or deactivates an
account) mid-session, trusting the token's `role` field would let that user
keep acting as before until their token expired. Re-querying PostgreSQL on
every admin-gated request means a role change or deactivation takes effect
on the very next request, not up to 8 hours later. This is exercised by
`backend/tests/middleware.auth.test.js` ("re-checks the role in the database
rather than trusting the JWT claim").

The frontend's `AdminRoute`/`ProtectedRoute` (`src/routes/`) are a **UX
convenience only** - they hide/redirect pages a user shouldn't see. They are
never the actual security boundary; every admin-only backend route enforces
itself independently, so a direct API call (curl, Postman, a modified
frontend) is rejected exactly the same way a redirected page would be.

## 3. Files responsible for RBAC

| File | Responsibility |
|---|---|
| `backend/middleware/auth.js` | `authenticateToken`, `requireRole`, `requireAdmin` - the single source of truth for authorization |
| `backend/server.js` | Applies the middleware to every mutating endpoint and to admin-only reads (`/api/admin/*`, `/api/employees`, `/api/departments`) |
| `backend/database/migrations/002_users_rbac_fields.sql` | Adds `is_active`, `must_reset_password`, and a `CHECK (role IN ('Employee','Admin'))` constraint |
| `src/routes/ProtectedRoute.jsx`, `src/routes/AdminRoute.jsx` | Frontend UX gating (not a security boundary - see above) |
| `src/services/apiClient.js` | Attaches the signed-in user's JWT to every write request |

### Endpoints requiring Admin role

All `POST`/`PUT`/`DELETE` on: `news`, `circulus`, `faqs`, `policies`,
`documents`, `wellness` (create only), `employees`, `departments`, plus all
of `/api/admin/*` (stats, user list, role/status changes, invites).

### Endpoints requiring only a valid login (any role)

`GET` on all content endpoints, `GET /api/employees` (staff directory),
`GET /api/departments`, `POST /api/calendar-events` (any staff member can
book the boardroom or add a calendar entry - this was intentionally **not**
restricted to Admins, since it's a normal everyday action in
`src/pages/Calendar.jsx`, not a content-publishing action).

### Self-protection rules

- `PUT /api/users/:id` (profile edit) now requires the requester to be
  either the profile owner or an Admin - previously any valid token could
  edit any user's profile by changing the URL's `:id`.
- `PUT /api/admin/users/:id/role` and `PUT /api/admin/users/:id/status`
  refuse to demote or deactivate the **last active Admin account**, so the
  system can never be left with zero administrators.
- `POST /api/auth/register` always forces `role: 'Employee'` server-side,
  regardless of what the client sends - there is no client-controlled field
  anywhere that can grant Admin on signup.

## 4. Managing users as an Admin

From **Admin Center -> Users & Roles** (`/#/admin/users`):

- **Invite a user** - enter an existing employee's email; they receive a
  one-time password-set link (emailed if `EMAIL_USER`/`EMAIL_PASSWORD` are
  configured in `backend/.env`, otherwise the link is printed to the backend
  server console for manual delivery). No password is ever chosen on their
  behalf.
- **Change a role** - the dropdown in the Role column. Blocked if it would
  leave the system with zero active Admins.
- **Activate/Deactivate** - deactivated accounts are rejected at login
  (`403`) even with a correct password, and lose API access on their very
  next request if already logged in.

From **Admin Center -> Employees** (`/#/admin/employees`): create, edit, and
deactivate employee directory records (search/filter/paginate included).
Deactivation is a soft delete (`status = 'Inactive'`) - employee history and
any linked user account are preserved.

From **Admin Center -> Departments** (`/#/admin/departments`): create, edit,
and deactivate departments. A department with active employees still
assigned cannot be deactivated (`409`) until they're reassigned.

## 5. Testing Admin access yourself

```bash
cd backend
npm test
```

`backend/tests/rbac.integration.test.js` spins up the real Express app
in-process (no port bound) against your local PostgreSQL database and
verifies, end-to-end: registration always yields `Employee` regardless of
client input, login rejects bad passwords, unauthenticated/non-admin
requests get 401/403 on every admin-only endpoint, a non-admin can still
read shared content, profile edits are owner/Admin-only, and the last-Admin
protections hold. It uses employee ids >= 900000 as fixtures and removes
them in `afterAll` - it never touches the real 159-employee dataset.

`backend/tests/middleware.auth.test.js` unit-tests the middleware in
isolation (mocked database) for fast, deterministic coverage of every
branch: missing token, invalid token, deactivated account, wrong role, and
the "DB wins over stale JWT role claim" behavior described in §2.

Frontend: `npm test` (Vitest) covers `isAdmin()`/session-helper edge cases
(case-sensitivity, corrupted storage, logout clearing state) and
`AdminRoute`'s three outcomes (logged out -> login, Employee -> `/home`,
Admin -> renders).

## 6. UI/UX overhaul (content forms, Programmes & Units, accessibility)

A follow-up pass audited the full Admin experience end-to-end and made the
following changes:

- **Rich text editor replaces raw Markdown.** `src/components/RichTextEditor.jsx`
  (Tiptap + `tiptap-markdown`) is now used for every long-text Admin field -
  News full story, Knowledge Centre overview, FAQ answer. No Markdown syntax
  or example text (`# New Content`, `## Introduction`, "Tip: you can use
  Markdown...") is shown to Admins anymore. The editor still reads/writes
  plain Markdown strings under the hood, so no database or display-page
  changes were needed.
- **Add Content was trimmed from 10 to 6 options.** Dashboard, Homepage,
  Programmes & Units, and Staff Directory were removed - they only ever
  wrote to a `localStorage` key nothing else read. Two quick-link buttons
  at the top of Add Content now point straight to **Admin Center →
  Employees** and **→ Departments**, which are the real, working
  equivalents.
- **Programmes & Units is now database-backed.** `src/pages/ProgramsUnits.jsx`
  previously rendered a hardcoded 6-entry array with fabricated document/
  notice counts. It now calls `GET /api/departments` and shows each real
  department with its live employee count - managed the same way as
  everywhere else, through Admin Center → Departments.
- **Regression found and fixed via testing:** publishing a News article
  with the optional Summary, Author, or Image Link fields left blank sent
  `null` for `excerpt`/`author`/`image_url`, which are `NOT NULL DEFAULT ''`
  columns - a 500 instead of a successful publish. Root cause was
  `field || null` instead of `field || ""` in `backend/server.js`'s news
  handlers (pre-existing, not introduced by the RBAC work). Fixed, with a
  regression test in `backend/tests/news.test.js`.
- **Debounced search** (`src/hooks/useDebouncedValue.js`) on the Employees
  table search box, so typing doesn't fire a request per keystroke.
- **Accessible modals** (`src/components/admin/AdminModal.jsx`): every
  Admin create/edit dialog (Employees, Departments, Users invite) now closes
  on Escape, traps initial focus on the dialog, and exposes
  `role="dialog"`/`aria-modal`/`aria-labelledby` for screen readers.
- A pre-existing, unrelated bug was found and **intentionally left alone**
  (out of the Admin module's scope, per explicit instruction): the News &
  Circulars display page reads `item.publish_date`/`item.date_published`,
  fields that don't exist on the API response (the real column is
  `publication_date`), so published dates render as "Invalid Date" on that
  page. Flagging it here rather than silently leaving it undocumented.

## 7. Outstanding manual configuration

- **Email delivery** (`EMAIL_USER`/`EMAIL_PASSWORD` in `backend/.env`) is not
  configured in this environment. Invite/reset links currently fall back to
  being logged on the server instead of emailed. Set real Gmail SMTP
  credentials (or swap `nodemailer`'s transport) before relying on this in
  production.
- No other Admin accounts exist beyond `ungomane@ncdedat.gov.za`. Use
  **Admin Center -> Users & Roles -> Invite User** to create a second Admin
  as a safety net, since the system currently has exactly one.

## 8. Programmes & Units: sub-programme hierarchy

`src/pages/ProgramsUnits.jsx` ("Programmes & Units") shows each `departments`
row as a parent "programme" card. Programmes can now contain multiple
**sub-programmes**, shown via a drill-down popup.

### Data model

- New table: `sub_programmes` (`backend/database/migrations/010_sub_programmes.sql`)
  - `department_id` (FK to `departments`), `name`, `description`, `status`
    (`Active`/`Inactive`), timestamps. `UNIQUE (department_id, name)`.
  - Seeded with 3 placeholder sub-programmes per one of the 6 real
    departments (18 rows total), so the feature is demonstrable immediately.
    These are editable/removable by any Admin - they are not meant to be
    treated as final, authoritative data.
  - `employees.subprogramme` / `users.subprogramme` are **pre-existing,
    unrelated, legacy free-text columns** - 0 of 159 real employee rows have
    a non-blank value in them. They are not read or written by this feature
    and are not the source of truth for sub-programmes.

### Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/departments` | any logged-in user | now also returns `sub_programme_count` (Active-only count), alongside the existing `employee_count` |
| GET | `/api/departments/:id/sub-programmes` | any logged-in user | all of that department's sub-programmes (both statuses - the frontend decides what to show, see below). 404 if the department doesn't exist |
| POST | `/api/departments/:id/sub-programmes` | Admin | creates one. 400 blank name, 404 unknown department, 409 duplicate name (case-insensitive) within the same department |
| PUT | `/api/sub-programmes/:id` | Admin | updates name/description/status. 404 if unknown |
| DELETE | `/api/sub-programmes/:id` | Admin | soft-delete - sets `status = 'Inactive'`, same convention as departments (no hard delete, no "reactivate" either - matches that departments themselves have no reactivate action in the UI today) |

`src/services/subProgrammesService.js` mirrors
`src/services/departmentsService.js`'s conventions exactly (`getSubProgrammes`
uses a plain `fetch` + manual token header like `getDepartments`; the three
write functions use `authFetch`).

### Modal / drill-down UX

`src/components/programs/ProgrammeDetailsModal.jsx` is a single overlay/
dialog element with an internal `view` state machine
(`'programme' | 'subprogramme' | 'add-sub' | 'edit-sub'`) - it never stacks a
second modal backdrop, even while drilling into a sub-programme or opening
the Admin add/edit form. It fetches that programme's sub-programmes itself
on open.

- **Visibility rule** (mirrors the existing department-level rule, where
  `ProgramsUnits.jsx` already hides `status !== "Active"` departments from
  everyone): non-admins see only `Active` sub-programmes; Admins also see
  `Inactive` ones, with a status pill, so they can see what they deactivated.
- **Admin-only actions** (`+ Add Sub-Programme`, `Edit`, `Deactivate`) are
  gated by the `isAdmin` prop passed down from `ProgramsUnits.jsx`
  (`isAdmin()` from `authService.js` - a UI convenience only; `requireAdmin`
  on the backend is the real boundary, same pattern as everywhere else in
  this app).
- Escape key and the close (×) button close the whole modal from any view.
  The "← Back to {programme}" button inside the sub-programme view returns
  to the programme view without closing.

### Pre-existing bug fixed in passing

Every programme card's "Enter Workspace" button called
`navigate(\`/programmes/${slug}\`)` - a route that **does not exist anywhere**
in `src/App.jsx` (confirmed via grep before this work started). It was
already a dead link. It, and the card itself (now a clickable,
keyboard-operable element), both open the new Programme Details popup
instead. "Policies" and "Contacts" are unaffected (`stopPropagation` added so
they don't also trigger the card's click handler).

### Tests

- `backend/tests/subProgrammes.test.js` (15 cases) - create/list/update/
  deactivate permission checks, 404s, case-insensitive duplicate detection
  scoped per-department, and the `sub_programme_count` subquery. Uses its own
  disposable department fixture so assertions aren't coupled to the 18 seeded
  placeholder rows.
- `src/components/programs/ProgrammeDetailsModal.test.jsx` (15 cases) -
  loading/error/empty states, Active-only vs. Admin-sees-all visibility,
  single-dialog drill-down navigation, Escape/close, and the full Admin
  add/edit/deactivate flow (mocking `subProgrammesService`).
- `src/pages/ProgramsUnits.test.jsx` (6 cases) - sub-programme count tag,
  card/"Enter Workspace" both open the modal for the right department,
  "Policies"/"Contacts" still work unaffected (`ProgrammeDetailsModal` is
  stubbed here; its own behavior is covered by the file above).

All three suites were green at the time of writing, alongside the full
pre-existing backend (80 tests) and frontend (126 tests) suites with no
regressions. The feature was also verified live against the running dev
servers via a scripted, headless-browser pass (sessionStorage JWT injection,
same approach used elsewhere in this project's testing) covering: the
Active/Inactive visibility split as a real non-admin vs. real Admin, a full
live create -> edit -> deactivate round trip, mobile viewport (375px, no
horizontal scroll, bottom-sheet presentation), and that Policies/Contacts
still function.

### Known limitations

- No standalone `GET /api/sub-programmes/:id` - the frontend always already
  holds the full list in memory when drilling into one, same simplification
  departments themselves use (no `GET /api/departments/:id` exists either).
- No "reactivate" action exists for a deactivated sub-programme, matching the
  identical limitation that already exists for departments. A direct SQL
  update (`UPDATE sub_programmes SET status = 'Active' WHERE id = ...`) is
  the only way back today.
- The 18 seeded sub-programmes are realistic placeholders modeled on typical
  South African provincial DEDaT budget-programme structures, not an
  authoritative source - Admins should review/edit them via the new UI.
