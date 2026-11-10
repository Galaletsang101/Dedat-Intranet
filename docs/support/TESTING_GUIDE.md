# Testing Guide

## 1. Frameworks

| Side | Framework | Config |
|---|---|---|
| Backend | Jest 29.7 + Supertest 7.3.2 | `backend/package.json` → `"test": "jest --runInBand"` |
| Frontend | Vitest 5.1 + Testing Library | `vite.config.js` → `test: { environment: 'jsdom', setupFiles: ['./src/test-setup.js'] }` |

`--runInBand` runs backend test files sequentially (not in parallel) —
necessary because the integration tests share one real PostgreSQL
connection pool and fixture id ranges.

## 2. Directory structure

```
backend/tests/
├── middleware.auth.test.js         Unit tests, mocked DB - authenticateToken/requireRole
├── news.test.js                     Regression: excerpt/author/image_url NOT NULL bug
├── newsWellnessPublishing.test.js  Draft/Published visibility, video upload validation
└── rbac.integration.test.js        Full-app integration: register/login/RBAC/last-Admin protection

src/**/*.test.{js,jsx}   (co-located with the code they test)
├── services/authService.test.js
├── services/apiClient.test.js
├── utils/dateUtils.test.js
├── hooks/useDebouncedValue.test.js
├── components/VideoPlayer.test.jsx
├── components/admin/AdminModal.test.jsx
└── routes/AdminRoute.test.jsx
```

## 3. Running the suites

```powershell
# Backend - 38 tests across 4 files
cd backend
npm test

# Frontend - 51 tests across 7 files
cd ..
npm test
```

Both should report everything passing. If either doesn't, see
[`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) before assuming the code is
broken — the backend suite needs a real, reachable PostgreSQL database
with migrations applied; the frontend suite needs no external services.

## 4. What's tested

### Backend (`middleware.auth.test.js` — unit, mocked database)
- Missing/invalid/expired token → 401/403.
- Deactivated account → 403 even with a role that would otherwise pass.
- Non-admin role → 403 on an admin-only check.
- **The specific behavior that makes this RBAC model safe:** a token
  whose embedded `role` claim says `Employee` but whose live database row
  says `Admin` is granted access — proving the middleware checks the
  database, not the token.
- Nonexistent user id → 403.

### Backend (`rbac.integration.test.js` — integration, real app + real DB)
- Registration always returns `role: "Employee"`, even if the request
  body tries to send `role: "Admin"`.
- Registration against an email with no matching `employees` row → 404.
- Login rejects a wrong password.
- Login returns a token and never leaks `password_hash`.
- Unauthenticated write → 401; non-admin write → 403.
- A non-admin **can** read public/shared content and the employee
  directory.
- A user can edit their own profile; **cannot** edit another user's
  profile by changing the URL id.
- The real `ungomane@ncdedat.gov.za` Admin account is confirmed active
  with the Admin role.
- Demoting the last active Admin is blocked (`409`).

All fixture data in this file uses employee ids **≥ 900000**, far outside
the real 1-159 range, and is deleted in `afterAll` — this suite never
touches or leaves behind real data.

### Backend (`news.test.js`) — regression test
Proves `POST`/`PUT /api/news` succeeds when the optional `excerpt`,
`author`, and `image_url` fields are omitted or sent as empty strings —
this was a real bug (sending `null` into `NOT NULL DEFAULT ''` columns
caused a 500) found via manual testing and fixed during this engagement.

### Backend (`newsWellnessPublishing.test.js`)
- A `Draft` article/video doesn't appear in the public list.
- A `Draft` item 404s for an unauthenticated or non-admin request, and
  200s for an Admin.
- Publishing a Draft (`status: 'Published'`) makes it appear publicly.
- A nonexistent id 404s.
- Wellness creation requires a non-empty `video_url` (400 otherwise).
- Video upload: rejects no file, rejects a non-admin caller, accepts a
  valid small video file and returns a URL matching the expected
  `/uploads/videos/....mp4` shape, rejects a non-video file.

### Frontend
| File | Covers |
|---|---|
| `dateUtils.test.js` | `parseDate`/`formatDate`/`formatDateTime`/`formatRelative` — null/undefined/empty/invalid input, a full ISO timestamp, a date-only string parsed as local (not UTC) components, out-of-range values that the native `Date` constructor would otherwise silently roll over, and the specific assertion that none of the formatters can ever return the literal string "Invalid Date" |
| `VideoPlayer.test.jsx` | YouTube/Vimeo/direct-file URL detection; renders the right player type; never includes `autoplay=1` in an embed URL or an `autoplay` attribute on a `<video>` element |
| `AdminModal.test.jsx` | Renders as an accessible dialog (`role`, `aria-modal`, `aria-labelledby`); closes on Escape; closes on overlay click but not on clicking inside the dialog body |
| `AdminRoute.test.jsx` | Logged-out → redirected to login; logged-in non-admin → redirected to `/home`; logged-in admin → renders the protected content |
| `authService.test.js` | Session helpers (`isLoggedIn`, `isAdmin`, `logoutUser`, `getCurrentUser`) including a case-sensitivity check (`role: "admin"` lowercase must NOT count as Admin) and tolerance of corrupted `sessionStorage` data |
| `apiClient.test.js` | `authFetch()` attaches/omits the Authorization header correctly; `parseJsonResponse()` surfaces the server's error message or a fallback |
| `useDebouncedValue.test.js` | Debounce timing, including rapid successive changes only committing the final value |

## 5. What's NOT covered (be aware before relying on "tests pass" alone)

- Knowledge Centre, Policies, FAQ, and Calendar endpoints have no
  dedicated test file (only incidental coverage via shared RBAC checks).
- No end-to-end/browser automation test suite is committed to the
  repository — the live-browser verification performed during this
  engagement (Playwright scripts) was ad hoc and not saved as a
  repeatable test.
- No performance/load testing.
- No accessibility audit tooling (axe, Lighthouse CI) wired into the test
  run — accessibility was addressed manually (ARIA roles, focus
  management, keyboard support) but isn't continuously checked.

## 6. Writing a new test

Follow the existing pattern — see
[`../guides/DEVELOPER_GUIDE.md`](../guides/DEVELOPER_GUIDE.md) §6 for the
conventions (fixture id ranges, Supertest against the exported `app`,
co-locating frontend tests with their source file).

## 7. Before merging/completing any change

```powershell
cd backend && npm test
cd .. && npm test && npm run build
```

All three should succeed with no new failures. A clean `npm run build` is
included because Vite's build step surfaces some errors (e.g. bad
imports) that neither test suite would catch.
