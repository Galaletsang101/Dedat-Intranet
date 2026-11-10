# External Integrations

A short, honest list — what this application actually talks to outside
itself, and what it deliberately does not.

## 1. Email (Gmail SMTP via `nodemailer`)

- **What it's for:** password-reset links, and password-set links for
  Admin-invited accounts.
- **Configuration:** `EMAIL_USER` / `EMAIL_PASSWORD` in `backend/.env`.
  For a Gmail account, `EMAIL_PASSWORD` must be an
  [App Password](https://myaccount.google.com/apppasswords), not the
  account's normal login password (Gmail requires this for any
  third-party SMTP client when 2-factor auth is enabled, which it should
  be).
- **If unconfigured:** `sendAccountEmail()` in `backend/server.js`
  detects the missing credentials and logs the link to the backend's
  console instead of attempting to send — the feature degrades
  gracefully rather than failing requests. This is fine for local
  development; **a real deployment should configure these** or swap the
  transport for the organization's actual mail system.
- **Not integrated:** any transactional-email provider (SendGrid, SES,
  Postmark, etc.) — only raw Gmail SMTP is wired up.

## 2. Video/file storage (local disk)

- Admin-uploaded Wellness video files are stored on the backend server's
  **local disk** at `backend/uploads/videos/`, served back out via
  Express's static file middleware at `/uploads/videos/<filename>`.
- **Not integrated:** any cloud object storage (S3, Cloudflare R2,
  Azure Blob, Cloudinary, etc.). This is the single biggest deployment
  implication in this project — see
  [`../guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md) and
  [`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md) for what
  that means for any multi-instance or containerized hosting.
- Thumbnails for Wellness videos and images for News articles are
  **external links only** (an Admin pastes a URL) — there is no image
  upload feature; nothing is stored or proxied for images.

## 3. Video playback providers (YouTube, Vimeo)

- `src/components/VideoPlayer.jsx` detects a YouTube or Vimeo URL and
  renders a standard `<iframe>` embed (`youtube-nocookie.com`/
  `player.vimeo.com`) — no API key, OAuth, or server-side call is
  involved; this is a pure client-side embed, identical to pasting the
  same embed code into any website.
- Any other video provider's link falls through to being treated as a
  direct file URL (`<video src="...">`), which will only actually play
  if that URL really does serve a browser-playable video file.

## 4. Database

PostgreSQL — see [`DATABASE_DOCUMENTATION.md`](DATABASE_DOCUMENTATION.md).
Not a managed/cloud database in this project's current configuration;
`backend/db.js` connects to whatever host/port is in `backend/.env`,
which in development is `localhost`.

## 5. What this application does NOT integrate with

Documented explicitly so nobody assumes these exist and goes looking for
configuration that isn't there:

- No SSO / identity provider (no SAML, OAuth login, Active Directory /
  LDAP integration) — authentication is entirely self-contained
  (email + bcrypt-hashed password in this application's own database).
- No SMS/push notification provider.
- No payroll, HR information system, or other government system
  integration — the `employees` table is a standalone copy of staff data
  imported once from a static file, not a live sync with any external
  HR system.
- No analytics/telemetry provider.
- No CI/CD pipeline configuration in this repository (no `.github/workflows`,
  no `Dockerfile`) — see
  [`../guides/DEPLOYMENT_GUIDE.md`](../guides/DEPLOYMENT_GUIDE.md).
