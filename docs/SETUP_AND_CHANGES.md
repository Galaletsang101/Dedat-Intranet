# Start Here: What Changed & How to Run It

If you're pulling this repo fresh (or pulling the latest changes onto a
copy you already had running), read this first. It explains what's
different, walks through getting it running on your machine, and tells
you how to confirm everything actually works.

For the deep technical reference on any one area, see:
- [`USER_FLOW_AND_ADMIN.md`](USER_FLOW_AND_ADMIN.md) — full route/endpoint map
- [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) — Admin account, RBAC, user management
- [`NEWS_WELLNESS_GUIDE.md`](NEWS_WELLNESS_GUIDE.md) — dates, articles, video upload

---

## 1. What changed, in plain language

The intranet went through two rounds of work:

**Round 1 — Admin access was fake. Now it's real.**
Before: anyone logged in could reach the content-publishing screen and
hit every write endpoint directly — "Admin" was just a hidden/shown
button, not a real permission. Now: every endpoint that creates, edits,
or deletes anything checks the caller's role against the database on
every request. A dedicated **Admin Center** (`/#/admin`) was built for
managing employees, user accounts/roles, and departments — all backed by
PostgreSQL, none of it hardcoded. The account `ungomane@ncdedat.gov.za`
is the primary Admin.

**Round 2 — News, Wellness, and dates were broken. Now they work.**
- Dates across the app could render as the literal text `"Invalid Date"`.
  Fixed with one shared date utility used everywhere.
- Clicking a news article did nothing — there was no article page. Now
  there's a real one at `/#/news/:id`.
- An Admin uploading a Wellness video saved a link that only worked in
  their own browser tab and broke the moment they refreshed. Now uploaded
  videos are actually stored on the server and play for everyone.
- The News page looked nothing like the Homepage's news cards. Now it
  reuses the same design.

Both rounds also replaced several hardcoded/fake data sources (a static
159-employee file, fabricated newsletter images, invented fallback news
articles) with real PostgreSQL-backed data.

---

## 2. Running it on your machine

### Prerequisites
- Node.js (recent LTS) and npm
- A local PostgreSQL server running, with a database created for this
  project (e.g. `dedat_intranet`)

### First-time setup

```bash
# 1. Clone and enter the repo, then install both sides
npm install
cd backend && npm install && cd ..

# 2. Environment files (never commit the filled-in versions)
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit `backend/.env` with real values:

| Variable | Required? | Notes |
|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Yes | Your local PostgreSQL connection |
| `JWT_SECRET` | Yes | Any long random string — used to sign login tokens |
| `EMAIL_USER`, `EMAIL_PASSWORD` | No | A Gmail account for sending password-reset/invite emails. Without these, reset links are printed to the backend's console instead of emailed — fine for local dev |

```bash
# 3. Create the schema, then apply every migration (safe to re-run any time)
psql -U postgres -d dedat_intranet -f backend/database/schema.sql
cd backend
npm run migrate
```

You should see all six migrations listed as `Applying:` (or `Skipping
(already applied)` if you've run this before) — they add the Admin role
system, department management, password-reset tokens, and the
News/Wellness Draft-vs-Published workflow on top of the base schema.

```bash
# 4. Load the 159-employee staff directory and backfill their profile
#    fields (skills, phone, mentor flag, etc.) - safe to re-run
npm run import:employees
npm run migrate:employee-profiles

# 5. Make ungomane@ncdedat.gov.za an Admin (safe to re-run)
npm run provision:admin -- ungomane@ncdedat.gov.za
```

If that account doesn't have a password yet, this command prints a
one-time link (`#/reset-password?token=...`) instead of inventing one —
open it in the running app to set a real password. If the account
already has a password (most common — it likely self-registered already),
this just updates its role and prints confirmation.

```bash
# 6. Run both servers (two terminals, or two tabs)
cd backend && npm start     # http://localhost:5000
npm run dev                 # from the repo root — http://localhost:5173 (or next free port)
```

### If you already had this project running before these changes

Your database and `node_modules` aren't wiped by any of this. Just:

```bash
npm install && cd backend && npm install && cd ..   # pick up new packages
cd backend && npm run migrate                        # apply new migrations only
```

New npm packages you'll see get installed: `multer` (video file uploads),
`@tiptap/*` + `tiptap-markdown` (the rich text editor), and `vitest` +
`@testing-library/*` + `jest` + `supertest` (test runners, dev-only).

---

## 3. New things you'll notice

| Where | What's new |
|---|---|
| Top nav / bottom nav (as Admin) | An **Admin Center** link, alongside the existing **Add Content** |
| `/#/admin` | Overview stats, Employees, Users & Roles, Departments — all editable |
| `/#/add-content` | A toolbar-based rich text editor instead of raw Markdown textareas; a **Visibility** (Published/Draft) field on News and Wellness; a "Manage Existing..." table under each of those two forms for editing/publishing/deleting; file upload for Wellness videos now actually works |
| `/#/news/:id` | A brand new full-article reading page |
| News & Circulars page | Redesigned to match the Homepage's news cards |
| Wellness page | Videos show a real date; YouTube/Vimeo links and uploaded files both play correctly; works on phone-width screens now |
| `backend/uploads/` | New folder (auto-created, gitignored) holding Admin-uploaded video files |

---

## 4. Verifying it actually works

A quick end-to-end check after setup:

1. **Log in** as `ungomane@ncdedat.gov.za`. Confirm you land on `/#/home`
   and see **Admin Center** in the top nav.
2. **Admin Center → Employees**: the table should show 159 real people,
   searchable and filterable. Try editing one and saving.
3. **Admin Center → Departments**: should show real departments derived
   from the employee data, each with a live employee count.
4. **Add Content → News & Circulars**: write a short test article, set
   Visibility to Published, publish it. Go to **News and Circulars** in
   the main nav — your article should appear with a correct date, and
   clicking it should open the full article at `/#/news/<id>`.
5. **Add Content → Wellness**: either paste a YouTube link or upload a
   small video file, publish it. Go to **Wellness** — the video should
   appear with a correct date and actually play when you click **Watch
   Now**.
6. **Log out, log in as a non-Admin test account** (or just check without
   logging in where relevant): confirm **Admin Center** and **Add
   Content** are not visible, and that navigating to `/#/admin` directly
   redirects away.

If any of these don't behave as described, something in your local setup
differs from what's documented above — check `backend`'s console output
first (migration errors and auth failures both log there).

---

## 5. Running the test suites

```bash
cd backend && npm test   # Jest + Supertest — 38 tests
npm test                 # from the repo root — Vitest — 51 tests
```

Both should report all tests passing. These cover the RBAC rules, the
Draft/Published workflow, video upload validation, date formatting, and
the Admin UI's route guards — a good sanity check that your local
database/environment matches what's expected.
