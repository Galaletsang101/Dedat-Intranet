# DEDaT Intranet — Routes, Endpoints & User Flow

## How to think about this app

Picture the intranet as a government building with one front door (login), a
shared lobby (the pages every staff member can walk into), and one locked
supply closet (`/add-content`) that only shows up on the directory board if
you're badged as "Admin". The badge check, though, only hides the *sign on
the wall* — it doesn't lock the door. Anyone who knows the room number
(`#/add-content`) or the API endpoint can walk in and use the closet, badge
or not. That's the single most important thing to understand about the admin
flow here, and it's called out in detail below.

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
| `/programs-units` | `ProgramsUnits` | Programme/unit info (static + localStorage draft content) |
| `/staff-directory` | `StaffDirectory` | Staff directory (static `staffData.js`, **not** the `employees`/`users` DB tables) |
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

There is **exactly one** role check in the entire frontend:

```js
// src/components/BottomNav.jsx
...(user?.role === "Admin"
  ? [{ name: "Add Content", icon: <FaPlus />, path: "/add-content" }]
  : []),
```

`user` comes from `getCurrentUser()` (`src/services/authService.js`), which
just reads whatever JSON was stashed in `sessionStorage.user` at login time.

**How does a user ever get `role: "Admin"`?** Not through the app.
`POST /api/auth/register` (`backend/server.js`) hardcodes every new signup to
`role: "Employee"`:

```js
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
// ...
"Employee"   // <- fixed value, no way to request Admin via the UI
```

So an account only becomes Admin if someone manually runs
`UPDATE users SET role = 'Admin' WHERE id = ...` directly against Postgres.
There is no admin-management screen.

### 3.2 What "Admin" actually gates

- **Visibility only.** The `/add-content` route itself sits inside the same
  `<ProtectedRoute>` as every other page — it checks "is there a token?", not
  "is this user an Admin?". Any logged-in user who navigates directly to
  `#/add-content` gets the full publishing console, badge or not.
- **The backend endpoints Add Content calls have no auth middleware at all**
  (see the route table in §3.4) except `PUT /api/users/:id`, which only
  checks for *a valid JWT*, not a role. So the "Admin" concept currently
  exists purely as a UI convenience to hide a button from most staff — it is
  **not** an access-control boundary. Worth knowing if this is being
  evaluated for a security review or hardened before wider rollout.

### 3.3 The Add Content console (`src/pages/AddContent.jsx`)

One page, one big form that reshapes itself per content type. Flow:

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
        ├─ calendar event    → raw fetch POST /api/calendar-events
        └─ dashboard / homepage / programsUnits / staffDirectory
                             → NOT sent to the API — written to
                               localStorage["dedatPublishedContent"]
                               and a "dedatContentUpdated" window event
                               is fired (nothing currently listens for it
                               on those pages, so this content doesn't
                               actually surface anywhere yet)
```

The 10 content types available from the left rail:

| Page option | Backend-integrated? | Endpoint used |
|---|---|---|
| News & Circulars | ✅ | `POST /api/news` or `POST /api/circulus` (routed by category) |
| FAQ | ✅ | `POST /api/faqs` |
| Policies | ✅ | `POST /api/policies` |
| Knowledge Centre | ✅ | `POST /api/documents` |
| Wellness | ✅ | `POST /api/wellness` |
| Calendar Event | ✅ | `POST /api/calendar-events` |
| Dashboard | ❌ stub | localStorage only |
| Homepage | ❌ stub | localStorage only |
| Programmes & Units | ❌ stub | localStorage only |
| Staff Directory | ❌ stub | localStorage only |

### 3.4 Admin-console backend endpoints

| Method | Path | Auth required? | Table | Notes |
|---|---|---|---|---|
| `POST` | `/api/news` | None | `news` | Requires `title`, `content_markdown` |
| `POST` | `/api/circulus` | None | `circulus` | Requires `title` |
| `POST` | `/api/faqs` | None | `faqs` | Requires `question`, `answer`, `category` |
| `POST` | `/api/policies` | None | `policies` | Requires `title` |
| `POST` | `/api/documents` | None | `documents` | Requires `title` |
| `POST` | `/api/wellness` | None | `wellness_videos` | No required-field validation |
| `POST` | `/api/calendar-events` | None | `calendar_events` | Validates `title`/`start_time`/`end_time`; rejects overlapping `Boardroom` bookings with `409` |

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
- **`ProtectedRoute` is a client-only gate.** It never calls the server to
  verify the token is still valid — a token could be expired or tampered
  with and the route would still render until an API call eventually 401s.
- **Government-email allowlist is cosmetic.** `validateGovernmentEmail()`
  only checks the string ends in `@ncdedat.gov.za` client-side; the backend
  does not re-validate the email domain on register or login.
- **`PUT /api/users/:id`** (profile edit) is the *only* endpoint wrapped in
  `authenticateToken` middleware — but it still doesn't check that the JWT's
  `id` matches the `:id` in the URL, so any logged-in user could edit another
  user's profile by changing the path parameter.
- **Password reset is unimplemented.** `resetPassword()` in
  `authService.js` immediately throws `"Password reset is not available
  yet."` — `ForgotPassword.jsx` is wired up to a dead end. `backend/server.js`
  does configure a Gmail `nodemailer` transporter for this but no route uses
  it yet.

---

## 5. Full backend endpoint reference (`backend/server.js`, port 5000)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | Health check: `{ message: "DEDAT Intranet Backend is running" }` |
| `GET` | `/api/news` | — | List news, newest first |
| `POST` | `/api/news` | — | Create news article |
| `GET` | `/api/wellness` | — | List wellness videos *(route is defined twice — harmless duplicate, second definition shadows nothing since it's identical)* |
| `POST` | `/api/wellness` | — | Create wellness video |
| `GET` | `/api/calendar-events` | — | List calendar events, ascending by start time |
| `POST` | `/api/calendar-events` | — | Create event; blocks overlapping `Boardroom` bookings |
| `GET` | `/api/documents` | — | List knowledge-centre documents |
| `GET` | `/api/documents/:id` | — | Single document |
| `POST` | `/api/documents` | — | Create document |
| `PUT` | `/api/documents/:id` | — | Update document |
| `DELETE` | `/api/documents/:id` | — | Delete document |
| `GET` | `/api/policies` | — | List policies |
| `POST` | `/api/policies` | — | Create policy |
| `GET` | `/api/faqs` | — | List FAQs |
| `POST` | `/api/faqs` | — | Create FAQ |
| `GET` | `/api/circulus` | — | List circulars |
| `POST` | `/api/circulus` | — | Create circular |
| `GET` | `/api/users` | — | List all users (name/email/programme — no password data) |
| `POST` | `/api/auth/register` | — | Register (see §4) |
| `POST` | `/api/auth/login` | — | Login, issues JWT (see §4) |
| `PUT` | `/api/users/:id` | **JWT required** | Update own profile fields |

No `DELETE`/`PUT` routes exist yet for news, FAQs, circulars, policies, or
wellness videos, even though the frontend `*Service.js` files define
`updatePolicy`/`deletePolicy`/`updateFaq`/`deleteFaq`/etc. — calling those
frontend functions for anything but policies/documents will hit a 404,
because the corresponding backend routes were never added.

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

1. Same login as above, but the account's `users.role` column is `Admin`
   (set manually in the DB — no self-service path).
2. `BottomNav` now shows **Add Content**; clicking it (or navigating to
   `#/add-content` directly, role or not) opens `AddContent.jsx`.
3. Admin picks a content type, fills the form, clicks **Preview** to sanity
   check rendering, then **Publish**.
4. For the six DB-backed types (News, Circulars, FAQ, Policies, Knowledge
   Centre, Wellness, Calendar), `handlePublish()` calls the matching service
   function, which `POST`s to the corresponding `/api/...` route in §5 and
   the new row becomes immediately visible to all staff on the next page
   load of that section.
5. For the four stub types (Dashboard, Homepage, Programmes & Units, Staff
   Directory), the "published" content is only written to
   `localStorage["dedatPublishedContent"]` in the admin's own browser — it
   is **not** persisted server-side and other users never see it.
