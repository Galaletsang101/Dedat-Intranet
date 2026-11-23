# Authentication & Role-Based Access Control

Systematic reference for how login, sessions, and permissions work. For
the narrative of how the primary Admin account was configured and how to
manage other users day-to-day, see
[`../ADMIN_GUIDE.md`](../ADMIN_GUIDE.md) — this document is the technical
reference the narrative one points back to.

## 1. Account creation paths

| Path | Who can do it | Result |
|---|---|---|
| `POST /api/auth/register` (self-service Signup page) | Anyone with a `@ncdedat.gov.za` email matching an existing `employees` row that doesn't already have a `users` row | New account, **always** `role: 'Employee'`, `is_active: true` — there is no client-controlled field anywhere in this request that can grant Admin |
| `POST /api/admin/users/invite` | Admin only | New account for a specified employee, with a caller-chosen role, an unusable random placeholder password, `must_reset_password: true`, and a one-time password-set link emailed (or console-logged) to them |
| `backend/scripts/setAdminRole.js` (CLI) | Whoever has server/database access | Promotes an existing account to Admin, or provisions one from an `employees` record the same way the invite endpoint does. The script used once to make `ungomane@ncdedat.gov.za` the primary Admin. |

Nobody can self-assign Admin. The only two ways to become Admin are (a)
an existing Admin changing your role via Admin Center → Users & Roles, or
(b) the CLI script, which requires server access.

## 2. Password handling

- **Hashing:** bcrypt, 10 rounds (`bcryptjs`), on `users.password_hash`.
  Never returned by any API response (`delete user.password_hash` before
  the login response is sent; never selected by name elsewhere).
- **Forgot password:**
  `POST /api/auth/forgot-password { email }` always responds with the
  same generic message regardless of whether the email exists — this
  prevents the endpoint being used to enumerate valid staff emails. If it
  does exist, a random 32-byte token is generated, SHA-256 hashed, stored
  in `password_reset_tokens` (2h expiry, `purpose: 'reset'`), and the
  **plaintext** token is emailed (never stored).
- **Reset:** `POST /api/auth/reset-password { token, password }` hashes
  the incoming token the same way and looks it up; rejects if not found,
  already used, or expired. On success, sets a new `password_hash`,
  clears `must_reset_password`, and marks the token `used_at`.
- **Invite tokens** use the identical mechanism with `purpose: 'invite'`
  and a 48h expiry.
- **No password is ever invented or stored anywhere for an Admin-created
  account** — invited users always go through this same reset flow.

## 3. Session / token mechanics

- JWT signed with `JWT_SECRET` (`backend/.env`), 8-hour expiry.
- Payload: `{ id, employee_id, email, role }`.
- Stored client-side in `sessionStorage` (not `localStorage`, not a
  cookie) — cleared when the tab/browser closes, which is a deliberate
  trade-off (simpler than cookie/CSRF handling, at the cost of
  session-per-tab rather than persistent login).
- **The `role` embedded in the token is never trusted for authorization
  decisions.** See §4.

## 4. Middleware (`backend/middleware/auth.js`)

```js
authenticateToken(req, res, next)
```
Verifies the JWT's signature and expiry only. Attaches the decoded
payload to `req.user`. 401 if no token, 403 if invalid/expired.

```js
requireRole(...allowedRoles)   // requireAdmin = requireRole("Admin")
```
Runs **after** `authenticateToken`. Re-queries
`SELECT role, is_active FROM users WHERE id = $1` on every single call —
deliberately ignoring whatever role was in the JWT. 401 if no
`req.user`, 403 if the account is deactivated or the current role isn't
in the allowed set.

**Why re-check the database instead of trusting the token?** A JWT is
valid for 8 hours. If an Admin demotes or deactivates someone mid-session,
trusting the token's `role` claim would let that person keep acting on
the old permission until their token happened to expire. Re-querying
means the change takes effect on their very next request. This exact
behavior is covered by
`backend/tests/middleware.auth.test.js` → *"re-checks the role in the
database rather than trusting the JWT claim."*

`isAdminRequest(req)` (defined inline in `server.js`, used only by the
two Draft-visibility endpoints) is a lighter-weight variant: tries to
verify a token if present, returns `false` on any failure instead of
rejecting the request — used where a route must stay reachable
unauthenticated (public article/video viewing) but behave differently for
Admins (seeing Drafts).

## 5. Role-permission matrix

| Capability | Employee | Admin |
|---|---|---|
| Log in, view own profile, edit own profile | Yes | Yes |
| Read News/Circulars/FAQs/Policies/Documents/Wellness (Published) | Yes | Yes |
| Read the Employee directory, Departments list | Yes | Yes |
| Book a calendar event / boardroom slot | Yes | Yes |
| See **Admin Center** / **Add Content** nav links | No | Yes |
| Create/edit/delete/publish News, Circulars, FAQs, Policies, Documents, Wellness | No | Yes |
| See or preview Draft content | No | Yes |
| Create/edit/deactivate Employees | No | Yes |
| Create/edit/deactivate Departments | No | Yes |
| View all accounts, change roles, activate/deactivate accounts, invite users | No | Yes |
| View Admin dashboard stats | No | Yes |
| Edit another user's profile by id | No | Yes (only exception to "owner only") |

Every "No" in the Employee column is enforced **server-side** — the
frontend's hidden nav links and `AdminRoute` redirect are UX convenience
only; see §6.

## 6. Frontend enforcement is NOT the security boundary

`src/routes/ProtectedRoute.jsx` and `src/routes/AdminRoute.jsx` check
`isLoggedIn()`/`isAdmin()` (reading `sessionStorage`) purely to decide
what to render and where to redirect. They:

- Never call the server to verify a token is still valid.
- Can be bypassed entirely by calling the API directly (curl, Postman, a
  modified build) — and that's fine, because every endpoint listed in
  §5 independently re-checks via the middleware in §4.

Both components use React Router's `useLocation()` specifically so the
check re-runs on every navigation rather than potentially reusing a stale
render — this was a real bug found and fixed during testing (a fast,
scripted sequence of in-app navigations could briefly show an admin
page's shell after logout before the guard caught up; the underlying API
calls were confirmed to still correctly return 401 throughout, so no data
was ever exposed — see
[`../ADMIN_GUIDE.md`](../ADMIN_GUIDE.md) for the full account).

## 7. Protected-route reference (frontend)

| Route | Guard |
|---|---|
| `/home`, `/dashboard`, `/about`, `/profile`, `/wellness`, `/calendar`, `/news-circulus`, `/news/:id`, `/programs-units`, `/staff-directory`, `/knowledge-center`, `/faq`, `/policies` | `ProtectedRoute` — must be logged in |
| `/add-content`, `/admin/*` | `ProtectedRoute` **and** `AdminRoute` — must be logged in **and** have `role === 'Admin'` in the locally-stored user object |
| `/`, `/signup`, `/forgot-password`, `/reset-password` | Public (pre-login) |
