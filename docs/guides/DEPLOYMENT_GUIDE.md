# Deployment Guide

**Important context up front:** no deployment has actually been
performed as part of this engagement. Everything in this handover was
built and verified against `localhost`. This guide documents what's
**already configured**, what a deployment would **require**, and what
**hasn't been decided yet** — it does not describe a deployment that
exists today.

## 1. What's already configured

| Item | Status |
|---|---|
| Frontend static build | `npm run build` (Vite) produces a `dist/` folder — verified working |
| Frontend hosting script | `npm run deploy` (via the `gh-pages` npm package) pushes `dist/` to a `gh-pages` branch for GitHub Pages hosting |
| Backend build | None needed — it's run directly with `node server.js` |
| Backend hosting | **Not configured** — no deployment script, no process manager config (no PM2/systemd unit), no platform-specific config (no `Procfile`, no `app.yaml`, etc.) |
| Database hosting | **Not configured** — development points at a local PostgreSQL install |
| Containerization | **None** — no `Dockerfile`/`docker-compose.yml` exists |
| CI/CD | **None** — no `.github/workflows` or equivalent |
| Domain / DNS / SSL | **Not configured** — nothing in this repository addresses any of these |

## 2. Hosting the frontend (the part that IS set up)

```powershell
npm run build       # produces dist/
npm run deploy       # builds, then pushes dist/ to the gh-pages branch
```

This hosts the **static frontend only**. The `HashRouter` routing choice
means this works on any static host (GitHub Pages, S3+CloudFront,
Netlify, etc.) without server-side routing rules — `#/admin` and similar
URLs are resolved entirely client-side.

**The deployed frontend needs to know where the backend lives.** Set
`VITE_API_URL` in the root `.env` (or your hosting platform's environment
variable mechanism, if it supports build-time env vars) to the backend's
real, publicly-reachable URL before building for production — otherwise
it will keep trying to reach `http://localhost:5000`, which won't exist
on a deployed visitor's machine.

## 3. Hosting the backend (requires a decision)

The backend is a plain Node.js/Express process that needs an **always-on
host** — static hosting (where the frontend can live) will not run it.
Reasonable options, none pre-selected in this codebase:

- A traditional VM/VPS running `node server.js` behind a process manager
  (PM2, systemd) and a reverse proxy (nginx) for TLS termination.
- A platform-as-a-service (Render, Railway, Fly.io, Heroku-style
  platforms) that runs a Node process directly from the repository.
- A containerized deployment — would require writing a `Dockerfile`
  first, since none exists.

Whichever is chosen, it needs:

- Node.js installed.
- The `backend/` directory's dependencies installed (`npm install`
  — `backend/package.json` has no separate build step).
- Environment variables set (see
  [`../technical/BACKEND_DOCUMENTATION.md`](../technical/BACKEND_DOCUMENTATION.md)
  §7) — **with production values, not the development ones** (a new
  `JWT_SECRET`, real database credentials, real `EMAIL_USER`/
  `EMAIL_PASSWORD`).
- **Persistent local disk**, because `backend/uploads/videos/` is where
  uploaded Wellness videos live — see §5 below before choosing a platform
  that uses ephemeral/stateless containers.
- Network access to the production PostgreSQL instance.
- `npm start` as the process entry point.

## 4. Hosting the database

Not configured in this codebase beyond `backend/db.js` reading
`DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` from the
environment — it will connect to whatever PostgreSQL instance those
variables point at. A managed PostgreSQL service (any major cloud
provider's offering) is the simplest production path; a self-hosted
instance works identically from the application's point of view as long
as it's reachable and those five variables are set correctly. `DB_SSL`
exists as an env var name in `.env.example` but is **not actually read**
by `db.js` — if the production database requires SSL, `backend/db.js`'s
`Pool` configuration will need an `ssl: { ... }` option added; this is
real, necessary follow-up work, not already handled.

## 5. The one architectural fact that most affects a deployment decision

Uploaded Wellness video files are stored on **local disk**
(`backend/uploads/videos/`), not an object storage service. This means:

- A **single backend instance** works fine as-is.
- **Multiple backend instances** (for scaling or high availability) would
  each have their own, different `uploads/` directory — a video uploaded
  via one instance wouldn't be visible through another. This needs to be
  resolved (shared/network storage, or migrating to S3-compatible object
  storage) **before** scaling the backend horizontally.
- A **containerized deployment** with ephemeral storage would lose
  uploaded videos on every container restart/redeploy unless the uploads
  directory is mounted to persistent storage.

See [`../technical/INTEGRATIONS.md`](../technical/INTEGRATIONS.md) §2.

## 6. Pre-production checklist

- [ ] New `JWT_SECRET`, not the development value
- [ ] New database credentials, not the development value
- [ ] `EMAIL_USER`/`EMAIL_PASSWORD` configured with a real sending
      account (see [`../technical/INTEGRATIONS.md`](../technical/INTEGRATIONS.md) §1)
- [ ] CORS reconsidered if the API will be reachable from the public
      internet (currently `cors()` with no origin restriction — see
      [`../handover/PROJECT_STATUS.md`](../handover/PROJECT_STATUS.md) §7)
- [ ] Persistent storage plan decided for `backend/uploads/videos/`
- [ ] Database migrations applied (`npm run migrate`) against the
      production database
- [ ] Employee data imported (`npm run import:employees` +
      `npm run migrate:employee-profiles`) if this is a fresh database
- [ ] Primary Admin account provisioned
      (`npm run provision:admin -- <email>`)
- [ ] A second Admin account created as an operational safety net
- [ ] SSL/TLS terminated somewhere in the request path (not handled by
      the Node process itself)
- [ ] Domain/DNS pointed at both the frontend host and the backend host
- [ ] `VITE_API_URL` set correctly before the frontend is built for
      production

## 7. Production verification (after deploying)

Repeat the same checks as
[`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) §16-19, against the
production URLs: health check (`GET /`), database connectivity, Admin
login, Admin Center loading real data.

## 8. Rollback

No automated rollback tooling exists. For a VM/PaaS deployment: keep the
previous release's code and redeploy it; database migrations are
additive (no migration in this project drops a column or table), so
rolling back application code while leaving the database at a newer
migration state is generally safe — the newer columns simply go unused
by the older code. Rolling the **database** back to a prior backup is a
separate, more disruptive action — see
[`../support/BACKUP_AND_RECOVERY.md`](../support/BACKUP_AND_RECOVERY.md).
