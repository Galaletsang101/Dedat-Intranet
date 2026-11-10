# Project Status Assessment

Every item below was verified by reading the actual code and/or running
the actual test suites and live application — nothing here is inferred
from file names or assumed from typical project conventions. Status
definitions:

- **Verified working** — implemented, tested (automated and/or live
  browser verification), and confirmed correct.
- **Implemented, lower test coverage** — works, exercised manually, but
  has thinner or no automated test coverage.
- **Partially implemented** — some of the feature is real, some is not.
- **Not implemented / decorative** — present in the UI but produces no
  real effect, or doesn't exist at all.

## 1. Fully implemented and verified

| Area | Evidence |
|---|---|
| Authentication (login, self-registration, logout, forgot/reset password) | `backend/tests/rbac.integration.test.js`, `middleware.auth.test.js`; live-tested end to end |
| Role-based access control (Admin vs. Employee, enforced server-side on every write and on admin-only reads) | 38 backend tests; live-tested with forged/stale tokens, deactivated accounts, last-Admin protection |
| Admin Center: Employee management (search/filter/paginate/create/edit/deactivate) | Live-tested against the real 159-record dataset; debounced search verified |
| Admin Center: Department management (create/edit/deactivate, live employee counts, blocked deletion with active employees) | Live-tested |
| Admin Center: User/role management (list, role change, activate/deactivate, invite with no invented password, last-Admin protections) | Live-tested; `news.test.js`/`newsWellnessPublishing.test.js`-style coverage pattern applied to RBAC in `rbac.integration.test.js` |
| News & Circulars: listing, full-article reading page, Draft/Published workflow, Admin edit/publish/delete | 13 tests in `newsWellnessPublishing.test.js`; live-tested including a found-and-fixed `NOT NULL` regression (`news.test.js`) |
| Wellness: video upload (real server-side file storage replacing a previously broken `blob:`-URL approach), YouTube/Vimeo/direct-file playback, Draft/Published workflow, Admin edit/publish/delete | Live-tested end to end: uploaded a real file, confirmed it on disk, confirmed it's publicly servable, confirmed it appears live on the public page |
| Centralized date formatting (`src/utils/dateUtils.js`) — eliminates the "Invalid Date" bug everywhere it occurred | 19 unit tests, including the specific date-only-string timezone-shift scenario; live-verified zero occurrences across Homepage, News, the article page, and Wellness |
| Rich text content authoring (no raw Markdown shown to Admins) | Live-tested: typed, formatted, published, confirmed clean rendering |
| Responsive layout on News, the article page, and Wellness (mobile breakpoints added to `wellness.css`, which had none) | Verified via `scrollWidth`/`clientWidth` overflow checks at a 375px viewport |
| Employee directory (`/staff-directory`), reading from PostgreSQL instead of the static `staffData.js` file | Live-tested; all 159 records confirmed present with backfilled profile fields |
| Programmes & Units page, reading from the real `departments` table instead of 6 hardcoded fake entries | Live-tested |

## 2. Implemented, lower test coverage

| Area | Notes |
|---|---|
| Knowledge Centre, Policies, FAQ pages | Full CRUD exists on the backend and is wired to the frontend (including via Add Content), but these three content types have no dedicated automated test file the way News/Wellness do — coverage here is incidental (via the shared RBAC tests) rather than targeted |
| Calendar / boardroom booking | Functionally complete (overlap detection, any-logged-in-user access) but has no dedicated test file |
| Self-registration against a government email domain | Client-side format check only (`validateGovernmentEmail`) is not re-validated server-side — low risk in practice because registration already requires a matching `employees` record, but noted as a gap |

## 3. Partially implemented

| Area | What works | What doesn't |
|---|---|---|
| Dashboard page (`/dashboard`) | Anonymous Suggestion Box and Anonymous Grievance Box forms accept input and show a client-side success message; the "See Archive" toggle works | **Everything else on this page is static/non-functional:** the greeting is hardcoded to `"Welcome back, Thabo"` regardless of who's logged in; HR Services, Wellness Center resources, Employee/Department Notices, Learning Centre, Internal Communications, and the Staff Spotlight are all hardcoded arrays with no backend table behind them; the four Quick Action buttons (Apply for Leave, Submit Forms, HR Templates, Contact HR) have no `action` value wired up and are **inert — clicking them does nothing**. The suggestion/grievance forms don't actually send anywhere either — no table exists to store them; the "success" message is purely cosmetic. |
| Legacy public `/api/users` endpoint | Returns real data from the database | Unused by the current frontend, has no authentication, and exposes name/email/programme for every account to anyone who finds the URL — effectively dead but not removed |

## 4. Not implemented (and explicitly out of this engagement's scope)

- Leave management / approvals (referenced only as a static label on the
  Dashboard and in `BottomNav`'s "E-Leave" link, which points nowhere)
- Reports/analytics beyond the Admin Overview stats panel
- Any external HR/payroll/SSO integration
- Push or SMS notifications
- Image upload (News/Wellness thumbnails are URL-only, no file upload)
- A notification system (no concept of in-app alerts/toasts outside the
  inline success/error banners already used in Admin forms)

None of these are hidden — several are visible as inert UI elements, and
this section exists specifically so nobody mistakes "the button exists"
for "the feature works."

## 5. Known bugs

See [`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md) for the
full, prioritized list with reproduction details. Headlines:

- **High:** None currently open that are known to affect a core workflow
  (the News/Wellness/date bugs that were High were fixed and verified
  this engagement).
- **Medium:** News display page (`NewsArticle.jsx`'s surrounding listing,
  specifically a leftover field-name mismatch outside the scope of this
  engagement — see Known Issues #1) — **already fixed**, listed there for
  traceability, not as open work.
- **Medium:** Dashboard page is almost entirely decorative (§3 above).
- **Low:** `/api/users` is dead, unauthenticated, and exposes staff PII
  to anyone who finds the URL even though nothing uses it.
- **Low:** 8 confirmed dead/orphaned frontend files (see
  `PROJECT_STRUCTURE.md` §3).

## 6. Technical debt

| Item | Why it's debt |
|---|---|
| `backend/server.js` is one ~2,300-line file with every route inline | Works fine today; will become harder to navigate and test in isolation as more endpoints are added. No `routes/`/`controllers/` split exists. |
| No ORM/migration framework beyond this project's own numbered SQL files | Fully functional, but means schema changes require manual SQL discipline (see `DATABASE_DOCUMENTATION.md`) rather than a tool enforcing it |
| Two separate `server.js` files in the repository (root + `backend/`) | Confusing for anyone new to the repo; the root one should be deleted once confirmed nothing external depends on it |
| 8 dead frontend files (§3 in `PROJECT_STRUCTURE.md`) | Harmless but adds noise when searching the codebase |
| No shared frontend state/cache layer | Each page re-fetches its own data on every visit; fine at current scale, would need revisiting if data volume or page complexity grows significantly |

## 7. Security concerns

Full detail in the Security section of
[`TECHNICAL_HANDOVER.md`](TECHNICAL_HANDOVER.md) and
[`../technical/AUTHENTICATION_AND_RBAC.md`](../technical/AUTHENTICATION_AND_RBAC.md).
Summary of what's **not yet** addressed:

- `backend/.env` currently holds real-looking database credentials and a
  JWT secret in plaintext in the working tree (as `.env` files normally
  do) — confirm it's genuinely gitignored in your environment and that
  these values are rotated before/if this repository's history is ever
  shared externally.
- `EMAIL_USER`/`EMAIL_PASSWORD` are unset in the development environment
  — password-reset/invite emails currently only log to the console
  locally; this must be configured for a real deployment.
- CORS is unrestricted (`cors()` with no origin allowlist) — acceptable
  for an internal tool on a private network, not for a public-internet
  deployment without revisiting it.
- Only one Admin account exists at the time of writing — operationally
  risky (a single point of failure for administration); the system's
  code correctly *prevents* deactivating/demoting the last Admin, but an
  organization should still create a second Admin as a safety net.

## 8. Deployment requirements not yet decided

See [`../guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md) for
the full list — headline items: where the backend will run (needs an
always-on Node host, not just static hosting), where the uploaded video
files will live in a multi-instance deployment (currently assumes one
server with persistent local disk), and what the production PostgreSQL
hosting will be.

## 9. Recommended future improvements, prioritized

| Priority | Item |
|---|---|
| Critical | Decide and configure production hosting for the backend + database before any real deployment (nothing here blocks local use, but nothing here is deployed either) |
| High | Configure `EMAIL_USER`/`EMAIL_PASSWORD` for real password-reset/invite email delivery |
| High | Create a second Admin account as an operational safety net |
| Medium | Decide whether the Dashboard page should be connected to real data/backend features or simplified to only show what's real |
| Medium | Move uploaded video storage to an object-storage service before considering any multi-instance/containerized deployment |
| Low | Remove the 8 dead frontend files and the root-level legacy `server.js` |
| Low | Split `backend/server.js` into `routes/`/`controllers/` if the API continues to grow |
| Low | Remove or properly scope the unauthenticated `/api/users` endpoint |
