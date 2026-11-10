# Frontend Documentation

## 1. Stack and entry point

React 19 + Vite 8, routed with `react-router-dom` v7 in **hash mode**
(`HashRouter` — URLs look like `https://host/#/dashboard`; this means the
app can be deployed to any static host, including GitHub Pages, with zero
server-side routing configuration). Entry point: `src/main.jsx` → mounts
`<App />` from `src/App.jsx`, which defines every route.

No global state library (Redux/Zustand/Context-for-app-state) — each page
fetches its own data via the services in `src/services/` and holds it in
local `useState`. The "global" state that exists (the logged-in user, the
JWT) lives in `sessionStorage`, read on demand through
`src/services/authService.js`'s `getCurrentUser()`/`getToken()` rather
than a React context provider.

## 2. Routing structure (`src/App.jsx`)

```
<HashRouter>
  AuthRoutes()                         /, /signup, /forgot-password, /reset-password
  <ProtectedRoute>                     (must be logged in)
    <Layout>                           TopNav + BottomNav + <Outlet/> + Footer
      /home, /dashboard, /about, /profile, /wellness, /calendar,
      /news-circulus, /news/:id, /programs-units, /staff-directory,
      /knowledge-center, /faq, /policies
      <AdminRoute>                     (must additionally be Admin)
        add-content
        <AdminLayout>                  tab nav: Overview/Employees/Users/Departments/Content
          /admin (index), /admin/employees, /admin/users, /admin/departments
```

`Layout.jsx` is the shared chrome (top nav, bottom quick-action bar,
footer) wrapping every protected page via `<Outlet/>`. `AdminLayout.jsx`
is a second, nested layout adding the Admin Center's own tab bar.

## 3. Directory guide

| Directory | Contents | When you'd touch it |
|---|---|---|
| `src/pages/` | One file per routed page (`Homepage.jsx` is a thin wrapper around `src/components/home/home.jsx` — see note below) | Adding/changing a page |
| `src/pages/admin/` | Admin Center screens (`AdminLayout`, `AdminOverview`, `AdminEmployees`, `AdminUsers`, `AdminDepartments`) | Admin-only features |
| `src/components/` | Shared, reusable UI pieces (`TopNav`, `BottomNav`, `Footer`, `VideoPlayer`, `RichTextEditor`) | A component used by 2+ pages |
| `src/components/admin/` | `AdminModal` (shared accessible modal shell), `NewsManager`/`WellnessManager` (edit/publish/delete tables mounted inside Add Content) | Admin content-management UI |
| `src/components/auth/` | Login/Signup form building blocks (`AuthCard`, `AuthInput`, `AuthButton`, `FormHeader`) | Auth page styling/fields |
| `src/components/home/` | `home.jsx` (the **actual** Homepage implementation — see note) and `homeData.js` (**unused**, dead) | Homepage content/layout |
| `src/components/news/` | `newspage_Component.jsx` (the News & Circulars page body) + its own `NewsPage.css` | News listing design |
| `src/components/staff/` | `staffData.js` (159-record source, now only used by the one-time import script — the live app reads from PostgreSQL), `staffDirectoryComponent.jsx`, `staffCard.jsx`, `staffSidebar.jsx` | Staff Directory display |
| `src/routes/` | `ProtectedRoute.jsx`, `AdminRoute.jsx` (guards), `authRoutes.jsx` (public route definitions) | Changing what gates access to what |
| `src/services/` | One file per backend resource — every `fetch()`/`XMLHttpRequest` call in the app lives here, never inline in a component | Changing an API call or adding a new one |
| `src/hooks/` | `useDebouncedValue.js` | Reusable stateful logic |
| `src/utils/` | `dateUtils.js` (all date formatting), `videoUtils.js` (video source detection) | Date formatting, video URL parsing |
| `src/styles/` | One CSS file per page/feature, plus `variables.css` (design tokens: colors, spacing, radius, shadows — the design system) | Visual changes |
| `src/layout/` | `Layout.jsx`, `AuthLayout.jsx` | Page chrome |

**Naming note:** `src/pages/Homepage.jsx` is a two-line wrapper that
renders `src/components/home/home.jsx` — the latter is where the actual
Homepage markup, data loading, and carousel logic live. Likewise
`src/pages/NewsCirculus.jsx` wraps `src/components/news/newspage_Component.jsx`,
and `src/pages/StaffDirectory.jsx` wraps `src/components/staff/staffDirectoryComponent.jsx`.
If you're looking for a page's real implementation and the `pages/` file
looks too small, check `components/` for the matching folder.

### Dead/orphaned files (confirmed unused — not imported anywhere)

`src/components/ExecCard.jsx`, `OrgChart.jsx`, `ProgramCard.jsx`,
`Reports.jsx`, `Timeline.jsx`, `src/components/news/CircularItem.jsx`,
`NewsCard.jsx`, `src/components/home/homeData.js`. Verified via a
repo-wide import search — none of these are referenced from any active
page or component. Safe to delete; left in place only because removing
dead code wasn't in scope for the work that found them. See
[`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md).

## 4. Services layer (`src/services/`)

| File | Backend resource |
|---|---|
| `apiClient.js` | Shared `authFetch()` (attaches the JWT automatically) and `parseJsonResponse()` — every other service file builds on this |
| `authService.js` | Login, register, logout, `getCurrentUser()`, `getToken()`, `isLoggedIn()`, `isAdmin()`, `forgotPassword()`, `resetPassword()` |
| `employeesService.js` | Employee directory CRUD + filter option lists |
| `departmentsService.js` | Department CRUD |
| `adminService.js` | Admin stats, user list, role/status changes, invites |
| `newsService.js`, `circulusService.js`, `faqsService.js`, `policiesService.js`, `documentsService.js`, `wellnessService.js` | One file per content type — `get*`, `create*`, `update*`, `delete*`, plus `getAdmin*()` variants that include Drafts |
| `staffServices.js` | Thin adapter translating `employeesService` responses into the shape `staffCard.jsx`/`staffDirectoryComponent.jsx` expect (historical — these components were originally written against a static array) |
| `validation.js` | `validateGovernmentEmail()` / `validateDedatEmail()` — client-side-only `@ncdedat.gov.za` format checks |

`apiClient.js`'s `authFetch()` is the pattern every write call should
use: it reads the token from `sessionStorage` and adds
`Authorization: Bearer <token>` automatically, so individual service
functions never handle that header themselves.

## 5. Key shared components

- **`RichTextEditor.jsx`** — Tiptap-based WYSIWYG editor used for every
  long-text Admin field (News body, Knowledge Centre overview, FAQ
  answer). Stores/loads plain Markdown under the hood
  (`tiptap-markdown`), so the database columns and `ReactMarkdown`-based
  display pages need no awareness of it — only the authoring experience
  changed from raw Markdown textareas.
- **`VideoPlayer.jsx`** — detects YouTube/Vimeo links vs. direct file
  URLs (via `utils/videoUtils.js`) and renders the appropriate player;
  never autoplays with sound.
- **`admin/AdminModal.jsx`** — the shared modal shell for every
  create/edit dialog in Admin Center and the News/Wellness managers:
  closes on Escape, moves focus on open, exposes
  `role="dialog"`/`aria-modal`/`aria-labelledby`.
- **`hooks/useDebouncedValue.js`** — used by the Employees search box so
  typing doesn't fire an API request per keystroke.

## 6. Styling approach

No CSS-in-JS, no Tailwind/CSS framework beyond Bootstrap (used only in a
handful of pages — Homepage, News, Staff Directory — for grid layout via
`react-bootstrap`'s `<Row>`/`<Col>`). Plain CSS files, one per
page/feature, importing shared design tokens (colors, spacing, radius,
shadows, typography) from `src/styles/variables.css` as CSS custom
properties (`var(--primary)`, `var(--space-md)`, etc.). New UI should
reuse these tokens rather than hardcoding colors/spacing.

## 7. Common tasks — where to look

| Task | Start here |
|---|---|
| Change the login process | `src/pages/Login.jsx`, `src/services/authService.js`, `backend/server.js` (`/api/auth/login`) |
| Modify user roles / permissions | `src/pages/admin/AdminUsers.jsx`, `src/services/adminService.js`, `backend/middleware/auth.js` |
| Add a new Admin feature | Follow the pattern in `src/pages/admin/AdminDepartments.jsx` (simplest full CRUD example) — list + `AdminModal` + service functions + a backend route group |
| Modify employee management | `src/pages/admin/AdminEmployees.jsx`, `src/services/employeesService.js` |
| Add a new page | Create under `src/pages/`, add a `<Route>` in `src/App.jsx`, add a nav link in `TopNav.jsx`/`BottomNav.jsx` if needed |
| Change navigation | `src/components/TopNav.jsx`, `BottomNav.jsx` |
| Update styling | The page's own file in `src/styles/`, or `variables.css` for a global token change |
| Modify an API endpoint | `backend/server.js` (routes are not split into separate files — see `BACKEND_DOCUMENTATION.md`) |
| Update News or Wellness functionality | `src/pages/AddContent.jsx` (create), `src/components/admin/NewsManager.jsx`/`WellnessManager.jsx` (edit/publish/delete), `src/pages/NewsArticle.jsx` / `Wellness.jsx` (display) |
| Fix date handling | `src/utils/dateUtils.js` — never add a new inline `new Date(x).toLocaleDateString()` |
| Modify file uploads | `src/services/wellnessService.js`'s `uploadWellnessVideoFile()`, `backend/server.js`'s multer config |
