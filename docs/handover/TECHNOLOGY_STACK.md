# Technology Stack

Every version below is copied directly from the project's own
`package.json` files or verified against the running environment — not
guessed.

## Frontend (`package.json` at repo root)

| Technology | Version | What it is | Why / where it's used |
|---|---|---|---|
| React | 19.2.7 | UI library | The entire `src/` application |
| Vite | 8.1.1 | Build tool / dev server | `npm run dev`, `npm run build` |
| react-router-dom | 7.18.1 | Client-side routing | `HashRouter` in `src/App.jsx` — every route |
| react-bootstrap + bootstrap | 2.10.10 / 5.3.8 | UI component library + CSS | Grid layout (`<Row>`/`<Col>`) on Homepage, News, Staff Directory; most other pages use plain CSS instead |
| react-icons | 5.7.0 | Icon set (Font Awesome + Heroicons subsets used) | Icons throughout the app |
| react-markdown | 10.1.0 | Renders Markdown as React elements, no raw HTML by default | News article body, FAQ answers, Knowledge Centre descriptions — doubles as the XSS defense for user-authored content (see `technical/AUTHENTICATION_AND_RBAC.md` and the Security section of the handover) |
| @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-placeholder | 3.33.0 | Rich text editor framework | `src/components/RichTextEditor.jsx` — the Admin content-authoring editor |
| tiptap-markdown | 0.9.0 | Tiptap extension that serializes/deserializes the editor's content as Markdown | Keeps the editor's output compatible with the existing `content_markdown` database columns and `react-markdown` display — no schema change was needed to add it |
| pg, cors, dotenv, express | (see Backend) | Also listed as root dependencies | Leftover from the legacy root `server.js` (port 3001, dead code) — not used by the actual frontend build |

### Frontend dev/test tooling

| Technology | Version | Purpose |
|---|---|---|
| vitest | 5.1.0 | Test runner (`npm test` from repo root) |
| @testing-library/react, @testing-library/jest-dom | 16.3.3 / 7.0.1 | Component/DOM testing utilities |
| jsdom | 31.0.0 | DOM environment for Vitest |
| eslint + eslint-plugin-react-hooks + eslint-plugin-react-refresh | 10.6.0 / 7.1.1 / 0.5.3 | Linting |
| gh-pages | 6.3.0 | `npm run deploy` — pushes a production build to GitHub Pages |

## Backend (`backend/package.json`)

| Technology | Version | What it is | Why / where |
|---|---|---|---|
| Express | 5.2.1 | HTTP server framework | `backend/server.js` — every route |
| pg (node-postgres) | 8.23.0 | PostgreSQL driver | `backend/db.js`, every `pool.query()` call — no ORM |
| bcryptjs | 3.0.3 | Password hashing | `users.password_hash` |
| jsonwebtoken | 9.0.3 | Signs/verifies session tokens | Login, `middleware/auth.js` |
| multer | 2.5.0 | Multipart file upload handling | `POST /api/wellness/upload` |
| nodemailer | 10.0.10 | Sends email via SMTP | Password-reset / invite emails (Gmail) |
| cors | 2.8.6 | Cross-origin request handling | Global middleware |
| dotenv | 17.4.2 | Loads `.env` into `process.env` | `backend/db.js`, `backend/server.js` |

### Backend dev/test tooling

| Technology | Version | Purpose |
|---|---|---|
| jest | 29.7.0 | Test runner (`npm test` from `backend/`) |
| supertest | 7.3.2 | HTTP assertions against the Express app in-process (no port bound) |

## Database

| Item | Value |
|---|---|
| Engine | PostgreSQL |
| Version used in development | 18.6 (verified via `SHOW server_version`) |
| Access pattern | Raw parameterized SQL via `pg`, no ORM/query builder, no migration framework beyond the project's own numbered SQL files + `scripts/migrate.js` |

## Build & deployment tooling

| Item | Notes |
|---|---|
| Build | `vite build` → static `dist/` (frontend), plain `node server.js` (backend, no build step needed) |
| Hosting (configured) | `gh-pages` package + `npm run deploy` script — pushes `dist/` to a `gh-pages` branch for GitHub Pages hosting. This hosts the **frontend only**; the backend needs its own always-on Node host (see `guides/DEPLOYMENT_GUIDE.md`) |
| CI/CD | **None configured** — no `.github/workflows`, no other pipeline definition found in the repository |
| Containerization | **None** — no `Dockerfile`/`docker-compose.yml` found |

## Why no ORM / no state management library / no CSS framework beyond Bootstrap

This reflects the codebase as it already existed before this engagement,
not a decision made during it — documented here as a fact for anyone
planning future work, not a recommendation either way. Raw SQL keeps
every query's exact behavior visible in `server.js` at the cost of more
boilerplate per endpoint; the lack of a shared state library means each
page independently fetches and owns its data, which is simple to reason
about per-page but means there's no cross-page cache (e.g. navigating
away from and back to the Employees list re-fetches it every time).
