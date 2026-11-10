# Known Issues

Every item here was found by reading the code and/or testing the live
application — nothing is speculative. Items marked **Fixed** are listed
for traceability (so nobody re-discovers and re-fixes the same thing) —
they are not open work.

## Critical
*(None identified. If one is found after this handover, it belongs
here, prioritized above everything else.)*

## High
*(None currently open. The date-handling, article-reading, and video
upload bugs that were High severity were found and fixed during this
engagement — see the Fixed section below.)*

## Medium

### 1. Dashboard page is almost entirely non-functional / decorative
**File:** `src/pages/Dashboard.jsx`
**Symptom:** the greeting always reads "Welcome back, Thabo" regardless
of who's logged in. HR Services, Wellness Center resources, Employee/
Department Notices, Learning Centre, Internal Communications, and Staff
Spotlight are all hardcoded arrays with no backend table behind them —
nothing an Admin does anywhere in the system changes what appears here.
The four Quick Action buttons (Apply for Leave, Submit Forms, HR
Templates, Contact HR) call `handleAction(item.action)`, but no item in
the `quickActions` array has an `action` property defined — `handleAction`
receives `undefined`, checks `if (!action) return;`, and does nothing.
**Clicking any of the four Quick Action buttons has no effect.**
**Impact:** Medium — doesn't block any other feature, but a staff member
could reasonably expect these buttons to do something.
**Suggested fix:** either wire this page to real backend data (would
require new tables/modules for leave, HR notices, etc. — out of scope
for a quick fix) or simplify it to only show what's real, with the
non-functional elements removed.

### 2. Anonymous Suggestion/Grievance boxes don't persist anywhere
**File:** `src/pages/Dashboard.jsx`
**Symptom:** submitting either form shows a client-side "sent to HR"
success message, but no API call is made and no database table exists to
receive it — the text is discarded the moment the component re-renders.
**Impact:** Medium — actively misleading (tells the user something
happened that didn't).
**Suggested fix:** either build a real backend endpoint + table for
these, or remove the false confirmation message until one exists.

### 3. Legacy, unauthenticated `/api/users` endpoint
**File:** `backend/server.js`
**Symptom:** `GET /api/users` requires no authentication and returns
every account's first name, surname, email, programme, subprogramme, and
position to anyone who finds the URL. It's not called by any current
frontend code (verified via a repository-wide search).
**Impact:** Medium — a PII exposure that happens to currently be unused,
not an actively exploited path, but a real finding on any security
review.
**Suggested fix:** remove the endpoint, or at minimum add
`authenticateToken`.

## Low

### 4. Two separate `server.js` files in the repository
**Files:** `server.js` (repo root, port 3001, ES modules, in-memory
fallback news array) vs. `backend/server.js` (port 5000, the real one).
**Impact:** Low — confusing for newcomers, not a functional bug (nothing
calls port 3001).
**Suggested fix:** delete the root-level file once confirmed nothing
external depends on it.

### 5. Eight dead/orphaned frontend files
**Files:** `src/components/ExecCard.jsx`, `OrgChart.jsx`,
`ProgramCard.jsx`, `Reports.jsx`, `Timeline.jsx`,
`src/components/news/CircularItem.jsx`, `NewsCard.jsx`,
`src/components/home/homeData.js`.
**Impact:** Low — adds noise when searching the codebase; no functional
effect since nothing imports them.
**Suggested fix:** delete, or confirm with the team they're intentionally
kept for a near-term reuse plan before removing.

### 6. Knowledge Centre, Policies, and FAQ have no "manage existing" Admin UI
**Context:** News and Wellness both have an edit/publish/delete table
under their Add Content form (`NewsManager.jsx`/`WellnessManager.jsx`).
Policies, Knowledge Centre documents, and FAQs can be **created** through
Add Content and the backend fully supports `PUT`/`DELETE` for all three,
but there's no equivalent frontend table to edit or remove one after
publishing — doing so currently requires calling the API directly.
**Impact:** Low — a usability gap, not a missing capability.
**Suggested fix:** build `PoliciesManager.jsx`/`DocumentsManager.jsx`/
`FaqsManager.jsx` following the exact pattern already established by
`NewsManager.jsx`.

### 7. Client-side-only government-email format validation
**File:** `src/services/validation.js`, used by `Login.jsx`/`Signup.jsx`.
**Symptom:** `validateGovernmentEmail()` checks the email ends in
`@ncdedat.gov.za` client-side only — the backend doesn't re-validate the
domain on register or login.
**Impact:** Low — registration is still gated by requiring a matching
`employees` record, which limits the practical exposure.
**Suggested fix:** add the same check server-side in
`POST /api/auth/register` for defense in depth.

### 8. `DB_SSL` environment variable is documented but unused
**File:** `backend/db.js` / `backend/.env.example`.
**Symptom:** `.env.example` lists `DB_SSL=false`, but `db.js`'s `Pool`
configuration never reads it — connecting to a database that requires
SSL will fail without a code change.
**Impact:** Low in development (local Postgres rarely requires SSL),
**becomes relevant** the moment a managed/cloud PostgreSQL instance is
used — see [`../guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md).
**Suggested fix:** add `ssl: process.env.DB_SSL === 'true' ? {...} :
false` to the `Pool` constructor when this becomes relevant.

## Fixed during this engagement (listed for traceability only)

| # | Issue | Root cause | Fix |
|---|---|---|---|
| F1 | "Invalid Date" rendered across News & Circulars | `newspage_Component.jsx` read `item.publish_date`/`date_published`, fields that don't exist — the real column is `publication_date` | Centralized `src/utils/dateUtils.js`; fixed the field names; same class of bug fixed in `KnowledgeCenter.jsx`, `Policies.jsx`, `Profile.jsx`, two Admin pages |
| F2 | Wellness file uploads didn't work for anyone but the uploader | `URL.createObjectURL(file)` (`blob:` URL, tab-local) was saved directly as `video_url` | Real server-side storage via `POST /api/wellness/upload` + `multer` |
| F3 | No way to read a full News article | No article detail page/route existed | New `/#/news/:id` page + `GET /api/news/:id` endpoint |
| F4 | `POST`/`PUT /api/news` 500'd when optional fields were blank | `field || null` sent into `NOT NULL DEFAULT ''` columns | Changed to `field || ""`; regression test added (`news.test.js`) |
| F5 | `wellness.css` had zero responsive breakpoints — horizontal overflow on phone-width screens | Fixed 70px side padding + fixed 320px search input | Added breakpoints at 992/768/480px |
| F6 | Any logged-in user could reach every content-publishing endpoint directly | No server-side role check existed anywhere | `backend/middleware/auth.js`'s `requireRole`/`requireAdmin`, applied to every write endpoint |
| F7 | Any logged-in user could edit any other user's profile by changing the URL id | `PUT /api/users/:id` only checked for *a* valid token, not ownership | Added an owner-or-Admin check |
| F8 | A frontend routing race could briefly show an admin page's shell right after logout | `ProtectedRoute`/`AdminRoute` weren't re-evaluating on rapid in-app navigation | Added `useLocation()` to both guards. **Note:** the backend correctly rejected every API call throughout this window in every test run — no data was ever actually exposed; this was a UI-only race, not a security breach |
