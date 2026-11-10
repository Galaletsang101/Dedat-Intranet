# Project Structure & Codebase Navigation Guide

## 1. Top-level layout

```
Dedat-Intranet/
├── backend/                  Express API + PostgreSQL access (port 5000)
│   ├── database/
│   │   ├── schema.sql          Base table definitions
│   │   └── migrations/         6 versioned migrations (001-006)
│   ├── middleware/
│   │   └── auth.js             authenticateToken, requireRole/requireAdmin
│   ├── scripts/                 One-off provisioning/maintenance scripts
│   ├── tests/                   Jest + Supertest (4 files, 38 tests)
│   ├── uploads/videos/           Admin-uploaded video files (gitignored, auto-created)
│   ├── server.js                 Every route - ~2,300 lines, not split into files
│   ├── db.js                     pg.Pool connection
│   └── importEmployees.js        One-time staffData.js -> employees loader
│
├── src/                       React frontend (Vite, HashRouter)
│   ├── pages/                    One file per route (some are thin wrappers - see note below)
│   │   └── admin/                 Admin Center screens
│   ├── components/                Shared UI components
│   │   ├── admin/                  AdminModal, NewsManager, WellnessManager
│   │   ├── auth/                   Login/Signup building blocks
│   │   ├── home/                   Homepage's real implementation (home.jsx)
│   │   ├── news/                   News & Circulars page's real implementation
│   │   └── staff/                  Staff Directory's real implementation + the 159-record source file
│   ├── services/                  Every API call in the app lives here
│   ├── routes/                    Route guards (ProtectedRoute, AdminRoute) + public route list
│   ├── hooks/                      Reusable React hooks
│   ├── utils/                      dateUtils, videoUtils
│   ├── styles/                     One CSS file per page + variables.css (design tokens)
│   └── layout/                     Page chrome (TopNav/BottomNav/Footer wrapper, Auth page wrapper)
│
├── docs/                       This documentation package
├── server.js                   LEGACY/DEAD - a separate, earlier Express app on port 3001, unused
├── package.json / package-lock.json     Frontend deps
└── README.md                    Quick-start pointer into docs/
```

Full per-directory purpose and a task → file lookup table are in
[`../technical/FRONTEND_DOCUMENTATION.md`](../technical/FRONTEND_DOCUMENTATION.md)
(frontend) and
[`../technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md)
(backend) — this file gives the map; those two give the detail.

## 2. The "wrapper" pattern — know this before you go looking for code

Three routed pages are two-line wrappers around the real implementation,
which lives in `src/components/<name>/`:

| Route file (`src/pages/`) | Real implementation |
|---|---|
| `Homepage.jsx` | `src/components/home/home.jsx` |
| `NewsCirculus.jsx` | `src/components/news/newspage_Component.jsx` |
| `StaffDirectory.jsx` | `src/components/staff/staffDirectoryComponent.jsx` |

If a page in `src/pages/` looks suspiciously small, this is why — check
`src/components/<matching-folder>/` for the actual markup and logic.

## 3. Confirmed dead/orphaned files

Verified by searching the entire `src/` tree for importers — these files
exist in the repository but are never referenced from any route or
component that's actually reachable in the running app:

| File | Notes |
|---|---|
| `src/components/ExecCard.jsx` | Not imported anywhere, including `About.jsx` |
| `src/components/OrgChart.jsx` | Same |
| `src/components/ProgramCard.jsx` | Same |
| `src/components/Reports.jsx` | Same |
| `src/components/Timeline.jsx` | Same |
| `src/components/news/CircularItem.jsx` | Superseded by inline markup in `newspage_Component.jsx` |
| `src/components/news/NewsCard.jsx` | Same |
| `src/components/home/homeData.js` | Not imported by `home.jsx` or anywhere else |

These are safe to delete whenever someone next touches these areas; they
were left in place because removing unrelated dead code wasn't in scope
for the work that identified them. The root-level `server.js` (as
opposed to `backend/server.js`) is dead for the same reason — see
[`../technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md) §2.

## 4. "I need to..." navigation table

| You need to... | Go to |
|---|---|
| Change the login process | `src/pages/Login.jsx`, `src/services/authService.js`, `backend/server.js` (`POST /api/auth/login`) |
| Modify user roles | `src/pages/admin/AdminUsers.jsx`, `backend/middleware/auth.js`, `backend/server.js` (`/api/admin/users/:id/role`) |
| Add a new Admin feature | Copy the pattern in `src/pages/admin/AdminDepartments.jsx` (simplest complete CRUD example: list + `AdminModal` + service file + backend route group) |
| Modify employee management | `src/pages/admin/AdminEmployees.jsx`, `src/services/employeesService.js`, `backend/server.js` (`/api/employees*`) |
| Add a new page | New file in `src/pages/`, add a `<Route>` in `src/App.jsx`, add a nav entry in `TopNav.jsx`/`BottomNav.jsx` |
| Change navigation | `src/components/TopNav.jsx`, `src/components/BottomNav.jsx` |
| Update application styling | The page's file under `src/styles/`; change a color/spacing globally via `src/styles/variables.css` |
| Modify an API endpoint | `backend/server.js` — search by path, it's one file (see `technical/API_DOCUMENTATION.md` for the full list) |
| Add a database table | New file in `backend/database/migrations/`, numbered after `006_...`; run `npm run migrate` from `backend/` |
| Modify database relationships | Same — migrations are the only sanctioned way to change the schema; never hand-edit `schema.sql` after the fact |
| Update News or Wellness functionality | Create: `src/pages/AddContent.jsx`. Edit/publish/delete: `src/components/admin/NewsManager.jsx` / `WellnessManager.jsx`. Display: `src/pages/NewsArticle.jsx`, `src/pages/Wellness.jsx`, `src/components/news/newspage_Component.jsx` |
| Fix date handling | `src/utils/dateUtils.js` only — never add a new inline `new Date(x).toLocaleDateString()` anywhere else |
| Modify file uploads | `src/services/wellnessService.js` (`uploadWellnessVideoFile`), `backend/server.js` (multer config, `POST /api/wellness/upload`) |
| Add a notification/alert pattern | No notification system exists yet — the closest precedent is the inline `.message`/`.admin-toast` success/error banners used throughout `AddContent.jsx` and the Admin pages; follow that pattern |
| Configure environment variables | `backend/.env` (see `technical/BACKEND_DOCUMENTATION.md` §7), `.env` at the repo root (only `VITE_API_URL`, optional) |
