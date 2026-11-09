# DEDaT Intranet — Routes, Endpoints & User Flow

> **Update:** The RBAC gaps originally documented throughout this file (the
> "badge is cosmetic, not a lock" framing below, the "no role check
> server-side" note in §3.2/§3.4, and the open endpoint table in §5) have
> been fixed. Every admin-only backend endpoint now enforces the Admin role
> itself via `backend/middleware/auth.js`, independent of anything the
> frontend shows or hides. See [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) for the
> current model. The sections below are kept largely as originally written
> for historical/navigational reference (route maps, page-by-page behavior
> are still accurate), with the security-relevant parts corrected inline.

## How to think about this app

Picture the intranet as a government building with one front door (login), a
shared lobby (the pages every staff member can walk into), and one locked
supply closet (`/add-content`, plus the newer `/admin` Admin Center) that
only shows up on the directory board if you're badged as "Admin". The badge
check used to only hide the *sign on the wall* without locking the door —
that has changed. The door is now locked server-side: every write to
`/add-content`'s endpoints and every `/admin` endpoint independently checks
the caller's role against PostgreSQL on every request, so knowing the room
number (`#/add-content`, `#/admin`) or the raw API endpoint no longer gets
you in without a valid Admin session.

```
 Browser (React, HashRouter)                 Server (Express, :5000)              Database
┌─────────────────────────────┐        ┌──────────────────────────────┐     ┌─────────────┐
│  Login / Signup              │──POST──▶  /api/auth/login             │──▶  │ PostgreSQL  │
│  (public)                    │        │  /api/auth/register          │     │  - users    │
└───────────┬───────────────────┘        └──────────────────────────────┘     │  - employees│
            │ JWT + user saved to                                             │  - news     │
            │ sessionStorage                                                  │  - circulus │
            ▼                                                                 │  - documents│
┌─────────────────────────────┐        ┌──────────────────────────────┐     │  - policies │
│  ProtectedRoute              │        │  /api/news                   │     │  - faqs     │
│  (checks sessionStorage      │──GET───▶  /api/documents              │──▶  │  - wellness_│
│   token only)                │        │  /api/policies                │     │    videos   │
└───────────┬───────────────────┘        │  /api/faqs                   │     │  - calendar_│
            │                            │  /api/circulus                │     │    events   │
            ▼                            │  /api/wellness                │     └─────────────┘
┌─────────────────────────────┐        │  /api/calendar-events         │
│  Layout                      │        └──────────────────────────────┘
│   ├─ TopNav                  │
│   ├─ <page content>          │        ┌──────────────────────────────┐
│   └─ BottomNav ── if role      ──POST──▶  same endpoints, create/update │
│        === "Admin": shows     │        │  (no role check server-side)  │
│        "Add Content" button   │        └──────────────────────────────┘
└─────────────────────────────┘
```

---

## 1. Two backends exist — only one is actually used

The repo has **two** Express servers. This matters for anyone documenting or
debugging "the API":

| File | Port | Used by frontend? | Notes |
|---|---|---|---|
| `backend/server.js` | **5000** | **Yes** — every `fetch()` in `src/` points at `http://localhost:5000/api/...` | The real, active API. Uses `bcryptjs` + `jsonwebtoken` for auth, raw `pg.Pool` via `backend/db.js`. |
| `server.js` (repo root) | 3001 | **No** | A separate/earlier Express app with its own CRUD for `/api/news` only, plus an in-memory fallback array. Nothing in `src/` calls port 3001. Treat it as legacy/dead code unless something external still hits it. |

Everything below documents `backend/server.js` (port 5000), since that's the
one the UI actually drives.

---

## 2. Frontend routes (`src/App.jsx`, `src/routes/authRoutes.jsx`)

React Router runs in **hash mode** (`HashRouter`), so real URLs look like
`https://host/#/dashboard`.

### Public (unauthenticated) routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `Login` | Sign in with a `@ncdedat.gov.za` email + password |
| `/signup` | `Signup` | Self-registration (only for staff already in the `employees` table) |
| `/forgot-password` | `ForgotPassword` | Password reset request (backend not implemented — see §5) |

### Protected routes (wrapped in `ProtectedRoute` → `Layout`)

All of these require a token in `sessionStorage` (see §4). None of them,
except the nav button that links to `add-content`, are restricted by role.

| Path | Component | What it shows |
|---|---|---|
| `/home` | `Homepage` | Landing/news feed page, default redirect target from `/` |
| `/dashboard` | `Dashboard` | HR services, notices, wellness shortcuts, anonymous suggestion/grievance boxes (client-side only, no backend persistence) |
| `/about` | `About` | Department leadership/exec cards (static data) |
| `/profile` | `Profile` | View/edit the logged-in user's own profile |
| `/wellness` | `Wellness` | Wellness videos list (`GET /api/wellness`) |
| `/calendar` | `Calendar` | Calendar/boardroom bookings (`GET`/`POST /api/calendar-events`) |
| `/news-circulus` | `NewsCirculus` | News & circulars feed (`GET /api/news`) |
| `/programs-units` | `ProgramsUnits` | Programme/unit info - reads `GET /api/departments`, managed via Admin Center → Departments |
| `/staff-directory` | `StaffDirectory` | Staff directory - reads `GET /api/employees`, managed via Admin Center → Employees |
| `/knowledge-center` | `KnowledgeCenter` | Document/knowledge resources (`GET /api/documents`) |
| `/faq` | `FAQ` | FAQ list (`GET /api/faqs`) |
| `/policies` | `Policies` | Policy documents (`GET /api/policies`) |
| `add-content` | `AddContent` | **The admin content-publishing console** — see §3 |

> **Gotcha:** `add-content` has no leading slash in `App.jsx`
> (`<Route path="add-content" ...>` instead of `"/add-content"`). Under
> `HashRouter` this still resolves correctly as a child of `/`, but it's easy
> to misread as broken when skimming the route table.

---

## 3. The Admin flow in detail

### 3.1 Who gets the admin badge

The frontend nav check is still the same simple UX convenience it always
was:

```js
// src/components/BottomNav.jsx
...(user?.role === "Admin"
  ? [{ name: "Admin Center", ... }, { name: "Add Content", ... }]
  : []),
```

What changed is how a user actually *gets* `role: "Admin"`, and what backs
that check up. `POST /api/auth/register` still hardcodes every new signup to
`role: "Employee"` — self-registration can never grant Admin, by design.

An account becomes Admin in one of two ways, both database-backed and both
Admin-gated:

1. `backend/scripts/setAdminRole.js` (run once from the command line) —
   used to provision the very first Admin, `ungomane@ncdedat.gov.za`.
2. An existing Admin uses **Admin Center → Users & Roles** to promote
   another account (`PUT /api/admin/users/:id/role`), which itself requires
   a valid Admin session to call.

See [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) for the full breakdown.

### 3.2 What "Admin" actually gates

- **Both visibility and access.** The `/add-content` route and the whole
  `/admin` Admin Center now sit behind `<AdminRoute>`
  (`src/routes/AdminRoute.jsx`), which redirects non-admins away client-side
  — but that's UX polish, not the real boundary.
- **Every backend endpoint those pages call enforces Admin itself.**
  `backend/middleware/auth.js`'s `requireAdmin` re-checks the caller's role
  and `is_active` flag against PostgreSQL on every request (not just the
  JWT's claim — see §2 of `ADMIN_GUIDE.md` for why). A direct API call with
  no token, an expired token, or a non-admin token is rejected with 401/403
  before any handler code runs. `PUT /api/users/:id` additionally now
  requires the caller to be the profile owner or an Admin, closing the
  previous "edit anyone's profile by changing the URL" gap.

### 3.3 The Add Content console (`src/pages/AddContent.jsx`)

One page, one form that reshapes itself per content type. Flow:

```
Pick a content type (left rail)
        │
        ▼
Fill in the type-specific fields  ──▶  validateForm()  ──▶  fails? show inline error
        │ passes
        ▼
"Preview" button ──▶ renderPreviewContent() in a modal (no network call)
        │
        ▼
"Publish" button ──▶ handlePublish()
        │
        ├─ news / circulars  → createNews() or createCirculus()
        ├─ faq               → createFaq()
        ├─ policies          → createPolicy()
        ├─ knowledge centre  → createDocument()
        ├─ wellness          → createWellnessVideo()
        └─ calendar event    → authFetch POST /api/calendar-events
```

The four former stub options (Dashboard, Homepage, Programmes & Units, Staff
Directory) were removed - they only ever wrote to
`localStorage["dedatPublishedContent"]`, nothing read that key, and Staff
Directory/Programmes & Units now have real, working equivalents: **Admin
Center → Employees** and **Admin Center → Departments** (linked directly
from two quick-link buttons at the top of this page). Keeping a second,
non-functional way to do the same thing would just be confusing. News/
Homepage-style announcements are published through **News & Circulars**,
which was already fully database-backed.

The 6 remaining content types, all database-backed:

| Page option | Endpoint used |
|---|---|
| News & Circulars | `POST`/`PUT`/`DELETE /api/news` or `/api/circulus` (routed by category) |
| FAQ | `POST`/`PUT`/`DELETE /api/faqs` |
| Policies | `POST`/`PUT`/`DELETE /api/policies` |
| Knowledge Centre | `POST`/`PUT`/`DELETE /api/documents` |
| Wellness | `POST /api/wellness` |
| Calendar Event | `POST /api/calendar-events` (any logged-in staff member, not Admin-only) |

**Markdown is no longer shown to Admins.** Every long-text field (News full
story, Knowledge Centre overview, FAQ answer) uses
`src/components/RichTextEditor.jsx` - a toolbar-based editor (bold, italic,
heading, lists, quote, link) built on Tiptap. It still stores and loads
standard Markdown under the hood via `tiptap-markdown`, so the
`content_markdown`/`answer` database columns and the `ReactMarkdown`-based
display pages needed no changes - only the authoring experience changed.
Previously, these fields were raw `<textarea>`s pre-filled with a visible
Markdown example (`# New Content\n## Introduction...`) that an Admin had to
notice and delete before writing real content.

### 3.4 Admin-console backend endpoints

| Method | Path | Auth required? | Table | Notes |
|---|---|---|---|---|
| `POST`/`PUT`/`DELETE` | `/api/news` | **Admin** | `news` | Requires `title`, `content_markdown` |
| `POST`/`PUT`/`DELETE` | `/api/circulus` | **Admin** | `circulus` | Requires `title` |
| `POST`/`PUT`/`DELETE` | `/api/faqs` | **Admin** | `faqs` | Requires `question`, `answer`, `category` |
| `POST`/`PUT`/`DELETE` | `/api/policies` | **Admin** | `policies` | Requires `title` |
| `POST`/`PUT`/`DELETE` | `/api/documents` | **Admin** | `documents` | Requires `title` |
| `POST` | `/api/wellness` | **Admin** | `wellness_videos` | Requires `title` |
| `POST` | `/api/calendar-events` | Any logged-in user | `calendar_events` | Not Admin-only - this is the everyday boardroom/meeting booking action from `Calendar.jsx`. Validates `title`/`start_time`/`end_time`; rejects overlapping `Boardroom` bookings with `409` |

"Admin" here means: a valid JWT *and* that account's live `role` in
PostgreSQL is `Admin` (`backend/middleware/auth.js`'s `requireAdmin`), not
just "has a token."

---

## 4. Authentication flow

```
Signup                                    Login
──────                                    ─────
POST /api/auth/register                   POST /api/auth/login
  1. email must already exist in           1. look up user by email
     `employees` table (pre-loaded           2. bcrypt.compare(password, hash)
     via backend/importEmployees.js)         3. sign JWT {id, employee_id,
  2. that employee must not already            email, role}, 8h expiry
     have a `users` row                      4. strip password_hash
  3. bcrypt-hash the password                 5. return {token, user}
  4. INSERT into `users`, role forced
     to "Employee"                        Frontend (authService.js):
                                             sessionStorage.setItem("token", ...)
                                             sessionStorage.setItem("user", ...)
```

- **Session storage, not cookies.** `isLoggedIn()` just checks
  `sessionStorage.getItem("token")`. Closing the tab/browser clears the
  session (sessionStorage is per-tab and non-persistent).
- **`ProtectedRoute`/`AdminRoute` are client-only gates.** They never call
  the server to verify the token is still valid — a token could be expired
  or tampered with and the route would still render until an API call
  eventually 401s/403s. This is fine precisely *because* the backend
  independently enforces the same rules on every request (see
  `ADMIN_GUIDE.md` §2) — the frontend gate only affects what's rendered, not
  what's reachable.
- **Government-email allowlist is cosmetic.** `validateGovernmentEmail()`
  only checks the string ends in `@ncdedat.gov.za` client-side; the backend
  does not re-validate the email domain on register or login. (Unchanged —
  low-risk, since registration still requires a matching `employees` row.)
- **`PUT /api/users/:id`** now requires the caller to be either the profile
  owner (`req.user.id === :id`) or an Admin — the previous "any logged-in
  user can edit any profile by changing the URL" gap is closed.
- **Password reset is now implemented.** `POST /api/auth/forgot-password`
  issues a one-time, hashed, 2-hour token (never reveals whether the email
  exists, to prevent account enumeration); `POST /api/auth/reset-password`
  consumes it. `ForgotPassword.jsx` → `ResetPassword.jsx`
  (`/#/reset-password?token=...`) complete the flow. If
  `EMAIL_USER`/`EMAIL_PASSWORD` aren't configured in `backend/.env`, the
  reset link is logged to the server console instead of emailed (fine for
  local dev, must be configured for production). The same mechanism backs
  Admin-issued user invites (`POST /api/admin/users/invite`).
- **Deactivated / pending accounts are rejected at login.** `is_active =
  FALSE` → 403; `must_reset_password = TRUE` (set for Admin-invited accounts
  until they set their own password) → 403 with a clear message.

---

## 5. Full backend endpoint reference (`backend/server.js`, port 5000)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | Health check: `{ message: "DEDAT Intranet Backend is running" }` |
| `GET` | `/api/news` | — | List news, newest first |
| `POST`/`PUT`/`DELETE` | `/api/news[/:id]` | **Admin** | Create/update/delete a news article |
| `GET` | `/api/wellness` | — | List wellness videos |
| `POST` | `/api/wellness` | **Admin** | Create wellness video |
| `GET` | `/api/calendar-events` | — | List calendar events, ascending by start time |
| `POST` | `/api/calendar-events` | **Any logged-in user** | Create event; blocks overlapping `Boardroom` bookings |
| `GET` | `/api/documents[/:id]` | — | List/get knowledge-centre documents |
| `POST`/`PUT`/`DELETE` | `/api/documents[/:id]` | **Admin** | Create/update/delete document |
| `GET` | `/api/policies[/:id]` | — | List/get policies |
| `POST`/`PUT`/`DELETE` | `/api/policies[/:id]` | **Admin** | Create/update/delete policy |
| `GET` | `/api/faqs` | — | List FAQs |
| `POST`/`PUT`/`DELETE` | `/api/faqs[/:id]` | **Admin** | Create/update/delete FAQ |
| `GET` | `/api/circulus` | — | List circulars |
| `POST`/`PUT`/`DELETE` | `/api/circulus[/:id]` | **Admin** | Create/update/delete circular |
| `GET` | `/api/employees` | **Logged in** | Paginated/searchable/filterable employee directory (replaces the old hardcoded `staffData.js`) |
| `GET` | `/api/employees/:id` | **Logged in** | Single employee record |
| `GET` | `/api/employees/departments-list`, `/api/employees/skills-list` | **Logged in** | Distinct filter option lists for the directory UI |
| `POST`/`PUT` | `/api/employees[/:id]` | **Admin** | Create/update an employee record |
| `DELETE` | `/api/employees/:id` | **Admin** | Soft-delete (deactivate) an employee |
| `GET` | `/api/departments` | **Logged in** | List departments with live employee counts |
| `POST`/`PUT` | `/api/departments[/:id]` | **Admin** | Create/update a department |
| `DELETE` | `/api/departments/:id` | **Admin** | Deactivate a department (blocked if active employees are still assigned) |
| `GET` | `/api/users` | — | Legacy public directory list (name/email/programme — no password data; unchanged, unused by the current frontend) |
| `GET` | `/api/admin/users` | **Admin** | Full user/account list (role, active status, last login) |
| `PUT` | `/api/admin/users/:id/role` | **Admin** | Change a user's role (blocks removing the last Admin) |
| `PUT` | `/api/admin/users/:id/status` | **Admin** | Activate/deactivate a user (blocks deactivating the last active Admin) |
| `POST` | `/api/admin/users/invite` | **Admin** | Create an account for an existing employee and email them a password-set link |
| `GET` | `/api/admin/stats` | **Admin** | Dashboard counts: employees, users, departments, pending registrations, recent news |
| `POST` | `/api/auth/register` | — | Register (see §4); role is always forced to `Employee` server-side |
| `POST` | `/api/auth/login` | — | Login, issues JWT (see §4); rejects deactivated/pending accounts |
| `POST` | `/api/auth/forgot-password` | — | Request a password-reset link (always responds identically, whether or not the email exists) |
| `POST` | `/api/auth/reset-password` | — | Consume a reset/invite token and set a new password |
| `PUT` | `/api/users/:id` | **Owner or Admin** | Update a profile — no longer lets any token edit any id |

`PUT`/`DELETE` now exist for news, FAQs, circulars, policies, documents, and
employees — the frontend `*Service.js` functions that previously 404'd
(`updateNews`/`deleteNews`, `updateCirculus`/`deleteCirculus`, etc.) are
wired up to real, Admin-gated endpoints.

---

## 6. Everyday staff user flow (end to end)

1. Staff member opens the site → lands on `/` (`Login`).
2. Enters `name@ncdedat.gov.za` + password → `POST /api/auth/login`.
3. On success, token + user JSON saved to `sessionStorage`; redirected to
   `/home`.
4. `Layout` renders `TopNav` + `BottomNav` on every protected page.
   - `TopNav` shows the user's initials/name (from the stored user object)
     and a dropdown with **View Profile** / **Logout**.
   - `BottomNav` shows shortcut buttons; **Add Content only appears if
     `user.role === "Admin"`**.
5. Staff browse News/Circulars, Policies, Knowledge Centre, FAQ, Wellness,
   Calendar, Staff Directory, Programmes & Units — all read-only `GET` calls
   against the endpoints in §5.
6. Logout clears `sessionStorage` and routes back to `/`.

## 7. Admin user flow (end to end)

1. Same login as above, but the account's `users.role` column is `Admin` —
   granted via `backend/scripts/setAdminRole.js` for the first Admin, or by
   an existing Admin through **Admin Center → Users & Roles** after that
   (see `ADMIN_GUIDE.md`).
2. `TopNav`/`BottomNav` now show **Admin Center** (`/#/admin`) and
   **Add Content** (`/#/add-content`); both routes — and every endpoint they
   call — independently verify the Admin role server-side, so this is a
   real access boundary, not just a hidden/shown button.
3. **Admin Center** has four tabs:
   - **Overview** — live stats (active employees, accounts, departments,
     employees without a user account yet) and a department breakdown,
     from `GET /api/admin/stats`.
   - **Employees** — search/filter/paginate the full employee directory;
     create, edit, or deactivate records.
   - **Users & Roles** — list every account, change roles, activate/
     deactivate accounts, invite new users (sends a password-set link; no
     password is ever chosen by the Admin). The last active Admin account
     can't be demoted or deactivated by anyone, including itself.
   - **Departments** — create, edit, or deactivate departments (blocked
     while active employees are still assigned).
4. **Add Content** still works as described below for publishing.
5. Admin picks a content type, fills the form, clicks **Preview** to sanity
   check rendering, then **Publish**.
6. For the six DB-backed types (News, Circulars, FAQ, Policies, Knowledge
   Centre, Wellness, Calendar), `handlePublish()` calls the matching service
   function (now sending the Admin's JWT - see `src/services/apiClient.js`),
   which `POST`s to the corresponding `/api/...` route in §5 and the new row
   becomes immediately visible to all staff on the next page load of that
   section.
7. The four former stub types (Dashboard, Homepage, Programmes & Units,
   Staff Directory) were removed from Add Content entirely - see §3.3. Staff
   and department records are managed from **Admin Center**, and
   announcements go through **News & Circulars**.
