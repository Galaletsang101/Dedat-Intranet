# DEDaT Intranet — Architecture & Routing Guide

## What this app is

An internal staff intranet for the Northern Cape Department of Economic
Development and Tourism (DEDaT). It is a client-side React SPA (Vite,
`HashRouter`) with **no custom backend** — Firebase (Auth, Firestore,
Storage) is the entire server-side layer. There is no Express/API server
in this repo; "endpoints" below means Firebase SDK calls, not REST routes.

Access is restricted to department staff: sign-up and login both require
an `@ncdedat.gov.za` email address (enforced client-side in
`src/services/validation.js`).

## Tech stack

- **React 19** + **react-router-dom 7** (`HashRouter`, so URLs look like
  `#/home`, `#/dashboard`) — chosen so the app works when deployed as a
  static site to GitHub Pages (`vite.config.js` sets `base: '/Dedat-Intranet/'`,
  and `npm run deploy` publishes `dist/` via `gh-pages`).
- **Firebase**: Authentication (email/password), Firestore (app data),
  Storage (wellness video uploads).
- **Bootstrap 5 / react-bootstrap** for some pages (News, Staff Directory,
  Homepage), hand-rolled CSS modules under `src/styles/` for the rest.

## Request flow (high level)

```
Browser (HashRouter)
   │
   ▼
src/App.jsx  ──splits routes into──▶ Auth routes (public)      ──▶ src/routes/authRoutes.jsx
   │                                 Protected routes (private) ──▶ src/routes/ProtectedRoute.jsx
   │                                                                    │
   │                                                     onAuthStateChanged (firebase/auth)
   │                                                                    │
   ▼                                                                    ▼
src/layout/Layout.jsx (TopNav, BottomNav, Footer, <Outlet/>)   redirects to "/" if not signed in
   │
   ▼
Page components (src/pages/*) ──▶ Services (src/services/*, src/firebase/*) ──▶ Firebase
                                                                                  ├─ Auth
                                                                                  ├─ Firestore
                                                                                  └─ Storage
```

## Routing (`src/App.jsx`)

All routes are declared in one tree, split into two groups:

| Group | Guard | Source |
|---|---|---|
| Auth routes | none (public) | `AuthRoutes()` from `src/routes/authRoutes.jsx` |
| Main intranet routes | `ProtectedRoute` → `Layout` wrapper | inline in `App.jsx` |

### Public (unauthenticated) routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `src/pages/Login.jsx` | Sign in with `@ncdedat.gov.za` email + password |
| `/signup` | `src/pages/Signup.jsx` | Create an account (role defaults to `"Employee"`) |
| `/forgot-password` | `src/pages/ForgotPassword.jsx` | Sends a Firebase password-reset email |

These render inside `src/layout/AuthLayout.jsx` (split-screen branding panel +
form), not inside the main `Layout`.

### Protected routes (require a signed-in Firebase user)

Wrapped by `ProtectedRoute` (listens to `onAuthStateChanged`; shows
`Loading...` while resolving, redirects to `/` if no user) then by `Layout`
(`TopNav` + `BottomNav` + `Footer` + page content via `<Outlet/>`).

| Path | Component | Purpose | Backed by |
|---|---|---|---|
| `/` → redirects to `/home` | — | default landing | — |
| `/home` | `src/pages/Homepage.jsx` → `components/home/home.jsx` | News/updates landing page, modal announcements | static data (`homeData.js`) |
| `/dashboard` | `src/pages/Dashboard.jsx` | Suggestion box / grievance forms, quick links | local state only (no persistence yet) |
| `/about` | `src/pages/About.jsx` | Department overview, org chart, timeline | static content (`OrgChart`, `Timeline` components) |
| `/profile` | `src/pages/Profile.jsx` | View/edit the signed-in user's profile | Firestore `users/{uid}` |
| `/wellness` | `src/pages/Wellness.jsx` | Wellness webinar library + Lyra EAP contact info | Firestore `wellnessVideos` + Storage |
| `/calendar` | `src/pages/Calendar.jsx` | Department calendar, holidays, boardroom bookings | Firestore `calendarEvents` (read) + static `src/data/holidays.js` |
| `/news-circulus` | `src/pages/NewsCirculus.jsx` → `components/news/newspage_Component.jsx` | News articles & circulars | static data in component |
| `/programs-units` | `src/pages/ProgramsUnits.jsx` | Programme/unit directory with contact modal | static data |
| `/staff-directory` | `src/pages/StaffDirectory.jsx` → `components/staff/staffDirectoryComponent.jsx` | Searchable/filterable staff list | `src/services/staffServices.js` (mock async API over static `staffData.js`) |
| `/knowledge-center` | `src/pages/KnowledgeCenter.jsx` | Document/policy upload & search | local state (`initialDocuments`), no Firestore wiring yet |
| `/faq` | `src/pages/FAQ.jsx` | Static FAQ accordion | static content |
| `/policies` | `src/pages/Policies.jsx` | Policy library, filters, pagination | static content |

`TopNav` (`src/components/TopNav.jsx`) renders the primary nav links shown
above and also subscribes to the current user's `users/{uid}` Firestore
document (`onSnapshot`) to show name/initials/position, and exposes
**Logout** (`signOut(auth)` → redirect to `/`).

## "Endpoints" — Firebase data access points

There is no REST/GraphQL API. Instead, each Firebase SDK call below is the
functional equivalent of an endpoint. All Firebase config comes from Vite
env vars (`VITE_BASE_apiKey`, `VITE_BASE_authDomain`, etc. — see
`src/firebase/firebase.js`); no `.env` file is committed, so these must be
supplied locally/in CI.

### Auth (`src/services/authService.js`, wraps `firebase/auth`)

| Function | Firebase call | Used by |
|---|---|---|
| `loginUser(email, password)` | `signInWithEmailAndPassword` | `Login.jsx` |
| `registerUser(email, password, userData)` | `createUserWithEmailAndPassword` + writes `users/{uid}` doc | `Signup.jsx` |
| `resetPassword(email)` | `sendPasswordResetEmail` | `ForgotPassword.jsx` |

`ProtectedRoute` and `TopNav` independently subscribe to
`onAuthStateChanged(auth, ...)` to know who's logged in.

### Firestore collections

| Collection | Shape (fields seen in code) | Read by | Written by |
|---|---|---|---|
| `users/{uid}` | `firstName, surname, employeeNumber, programme, subprogramme, position, email, role, createdDate` | `TopNav.jsx` (live `onSnapshot`), `Profile.jsx` (`getDoc`) | `authService.registerUser` (`setDoc` on signup), `Profile.jsx` (`updateDoc` on save) |
| `wellnessVideos` | `title, description, category, duration, thumbnail, video (URL), createdAt` | `Wellness.jsx` via `getWellnessVideos()` | `wellnessService.uploadWellnessVideo(file)` |
| `calendarEvents` | `date, title, time, endTime, category` | `Calendar.jsx` via `getDocs(collection(db,"calendarEvents"))` on mount | **not currently written** — `Calendar.jsx` imports `addDoc` but `saveEvent()` only pushes the new event into local React state, it is never persisted to Firestore |

### Storage

| Path | Written by | Read by |
|---|---|---|
| `wellnessVideos/{timestamp-filename}` | `wellnessService.uploadWellnessVideo` (`uploadBytes`) | `getDownloadURL` result is stored as `video` on the Firestore doc, then streamed by the `<video>` tag in `Wellness.jsx` |

### Mock service layer (no backend at all)

`src/services/staffServices.js` fakes an async API (`setTimeout` delays)
over the static array in `src/components/staff/staffData.js` — pagination,
search, department/skill filters. `getStaff`, `getDepartments`, `getSkills`,
`getRecentSkills`, `getStaffById` are consumed by
`components/staff/staffDirectoryComponent.jsx`. This is the pattern to
follow if/when the Staff Directory moves to a real Firestore collection.

## Known gaps worth knowing before extending this app

- `src/firebase/auth.js` exists but is **empty** — all auth logic actually
  lives in `src/services/authService.js` + direct `firebase/auth` imports
  in `TopNav.jsx`/`ProtectedRoute.jsx`.
- `Calendar.jsx` new-event save is **not persisted** (see table above).
- `KnowledgeCenter.jsx`, `Dashboard.jsx` (suggestions/grievances),
  `NewsCirculus.jsx`, `ProgramsUnits.jsx`, `Policies.jsx`, `FAQ.jsx` are all
  static/local-state only — no Firestore collection backs them yet.
- No Firestore security rules file is present in this repo; access control
  for `users`, `wellnessVideos`, `calendarEvents` is presumably configured
  in the Firebase console, not checked into source.
