# Developer Guide

How to work on this codebase day-to-day: conventions, how to extend it,
and how to keep changes safe. Pairs with
[`../handover/PROJECT_STRUCTURE.md`](../handover/PROJECT_STRUCTURE.md)
(where things live) and
[`../technical/FRONTEND_DOCUMENTATION.md`](../technical/FRONTEND_DOCUMENTATION.md)/
[`BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md) (how
the existing code is organized).

## 1. Coding standards observed in this codebase

- **No TypeScript** — plain JS/JSX throughout. Don't introduce TS for a
  single file; it would fragment the codebase's tooling.
- **No ORM** — raw parameterized SQL (`pool.query("... $1 ...", [value])`).
  Always use placeholders, never string-concatenate a value into a query.
- **Services own all network calls.** A React component should never
  call `fetch()`/`authFetch()` directly — add or extend a function in
  `src/services/` instead, so every API shape change has exactly one
  place to update.
- **`authFetch()` for any write request.** Use
  `src/services/apiClient.js`'s `authFetch()` (or a service function
  built on it) for anything that needs the JWT — don't hand-roll an
  `Authorization` header.
- **Admin enforcement happens on the backend, always.** A new
  Admin-only endpoint must use `authenticateToken, requireAdmin` (or
  `requireRole(...)`) in `backend/server.js` — a frontend-only check
  (hiding a button, an `AdminRoute`) is never sufficient on its own.
- **Centralized date formatting.** Never write a new
  `new Date(x).toLocaleDateString()` — import from `src/utils/dateUtils.js`.
- **No raw HTML rendering of user content.** Long-text fields go through
  `react-markdown` (no `dangerouslySetInnerHTML`, no `rehype-raw`) — this
  is the project's XSS defense for Admin-authored content; don't bypass
  it.

## 2. Folder/component conventions

- One file per page under `src/pages/`; shared/reusable pieces under
  `src/components/`. If a page grows large enough to need its own
  sub-components that nothing else uses, a `src/components/<page-name>/`
  folder is the established pattern (see `home/`, `news/`, `staff/`).
- Admin screens follow a consistent shape: a list/table
  (`admin-table` CSS classes from `src/styles/admin.css`), a create/edit
  form inside `AdminModal` (`src/components/admin/AdminModal.jsx`), and a
  service file with `get*`/`create*`/`update*`/`delete*` functions. Copy
  `src/pages/admin/AdminDepartments.jsx` as a starting template for a new
  Admin CRUD screen — it's the simplest complete example.
- CSS: one file per page/feature under `src/styles/`, using the design
  tokens in `variables.css` (`var(--primary)`, `var(--space-md)`, etc.)
  rather than hardcoded colors/spacing.

## 3. API development conventions

- Routes live directly in `backend/server.js` — there's no
  `routes/`/`controllers/` split (see
  [`../technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md)
  §2 for why, and the one thing worth reconsidering if the file keeps
  growing).
- Every handler: validate required fields first (`400` on missing data),
  run the query, return the inserted/updated row (`201`/`200`), catch
  and `console.error` + `500` on unexpected failure.
- Public read endpoints return only `status = 'Published'` content where
  a `status` column exists; an Admin-only `/api/admin/<resource>`
  variant returns everything, following the pattern in
  `GET /api/admin/news` / `GET /api/admin/wellness`.
- Soft-delete, don't hard-delete, anything with organizational history
  attached (`employees`, `departments` both use a `status` column rather
  than `DELETE`).

## 4. Database migration practice

- New schema changes are a new numbered file in
  `backend/database/migrations/`, named `007_description.sql` (next in
  sequence), never a hand-edit of `schema.sql` or an existing migration.
- Use `ADD COLUMN IF NOT EXISTS` / guarded `DO $$ ... END $$;` blocks for
  constraints, exactly like migrations 002-006 — this keeps every
  migration safe to re-run, which the project's own `scripts/migrate.js`
  relies on.
- Run `npm run migrate` from `backend/` to apply; it records what's
  applied in `schema_migrations` automatically.
- Never destroy existing data in a migration without an explicit,
  deliberate reason — this project has a standing requirement to
  preserve the 159 employee records.

## 5. Git workflow

No branching/commit convention is enforced by tooling in this repository
(no commit-lint config, no PR template found). Sensible defaults in the
absence of a documented house style: feature branches off the main
branch, descriptive commit messages explaining *why* over *what*, and a
new commit rather than amending published history. Confirm your
organization's actual preference before establishing a different pattern.

## 6. Testing requirements for new work

- Backend: add a test file under `backend/tests/` using the existing
  pattern (Jest + Supertest against the exported `app`, not a running
  server — see `backend/tests/news.test.js` as a small, focused example).
  Use employee/record ids outside the real data range (≥ 900000, by
  established convention) for any fixture you create, and clean it up in
  `afterAll`.
- Frontend: add a `*.test.js`/`*.test.jsx` file next to the code it
  tests, using Vitest + Testing Library (see
  `src/hooks/useDebouncedValue.test.js` for a simple example,
  `src/components/admin/AdminModal.test.jsx` for a component example).
- Run both suites (`cd backend && npm test`, and `npm test` from the
  root) before considering any change complete — see
  [`../support/TESTING_GUIDE.md`](../support/TESTING_GUIDE.md).

## 7. Dependency updates

No automated dependency-update tooling (Dependabot, Renovate, etc.) is
configured. When updating a dependency by hand, check both
`package.json` files (root and `backend/`) — they're independent. Rerun
both test suites and `npm run build` after any update.

## 8. Error logging

Current state: `console.error(...)` on the backend for any caught
exception, nothing more structured (no log aggregation, no error
tracking service like Sentry). If this becomes a production system,
adding structured logging/error tracking is a reasonable near-term
investment — see
[`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md) §9.

## 9. Adding a new module (worked example: "Announcements")

Walking through what a new Admin-manageable content type would require,
using the existing News implementation as the template:

1. **Migration:** `007_announcements.sql` creating an `announcements`
   table (`id`, `title`, `body`, `status`, timestamps — copy `news`'s
   shape).
2. **Backend routes** in `server.js`: `GET /api/announcements` (public,
   Published only), `GET /api/announcements/:id`, `POST`/`PUT`/`DELETE`
   (Admin-gated, following the News block verbatim), `GET
   /api/admin/announcements` (Admin, all statuses).
3. **Frontend service:** `src/services/announcementsService.js` with
   `get*`/`create*`/`update*`/`delete*`/`getAdmin*` functions, mirroring
   `newsService.js`.
4. **Admin UI:** add it as a new option in `AddContent.jsx`'s
   `PAGE_OPTIONS`, build its form fields, and add a management table
   component (copy `src/components/admin/NewsManager.jsx`).
5. **Display:** a new page/route if it needs one, or fold it into an
   existing page's listing.
6. **Tests:** a `backend/tests/announcements.test.js` covering the
   Draft/Published visibility rules, following
   `newsWellnessPublishing.test.js`.
7. **Docs:** update `technical/API_DOCUMENTATION.md` and
   `technical/DATABASE_DOCUMENTATION.md`.

## 10. Updating documentation

This `docs/` package is the source of truth for anyone who didn't write
the code. When you change behavior that's documented here, update the
relevant file in the same change — don't let docs drift. If you're
unsure which file covers a topic, check
[`../README.md`](../README.md) (the index) first.
