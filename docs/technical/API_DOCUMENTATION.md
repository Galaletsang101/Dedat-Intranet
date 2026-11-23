# API Documentation

Base URL in development: `http://localhost:5000`. All request/response
bodies are JSON unless noted (the one exception is the video upload
endpoint, which is `multipart/form-data`). All 52 endpoints below were
extracted directly from `backend/server.js` — nothing here is aspirational.

**Auth column legend:** "Public" = no token needed. "Logged in" = any
valid JWT. "Admin" = valid JWT **and** the account's live `role` in the
database is `Admin` (re-checked on every request — see
[`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md)). "Owner/Admin"
= the token's user id must match the target, or be an Admin.

## 1. Full endpoint index

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/` | Health check | Public |
| GET | `/api/news` | List Published news | Public |
| GET | `/api/news/:id` | Single article (Draft → 404 unless Admin) | Public/Admin |
| POST | `/api/news` | Create article | Admin |
| PUT | `/api/news/:id` | Update article | Admin |
| DELETE | `/api/news/:id` | Delete article | Admin |
| GET | `/api/wellness` | List Published videos | Public |
| GET | `/api/wellness/:id` | Single video (Draft → 404 unless Admin) | Public/Admin |
| POST | `/api/wellness/upload` | Upload a video file (multipart) | Admin |
| POST | `/api/wellness` | Create video | Admin |
| PUT | `/api/wellness/:id` | Update video | Admin |
| DELETE | `/api/wellness/:id` | Delete video | Admin |
| GET | `/api/calendar-events` | List events | Public |
| POST | `/api/calendar-events` | Create event (blocks overlapping Boardroom bookings) | Logged in |
| GET | `/api/documents` | List documents | Public |
| GET | `/api/documents/:id` | Single document | Public |
| POST | `/api/documents` | Create document | Admin |
| PUT | `/api/documents/:id` | Update document | Admin |
| DELETE | `/api/documents/:id` | Delete document | Admin |
| GET | `/api/policies` | List policies | Public |
| GET | `/api/policies/:id` | Single policy | Public |
| POST | `/api/policies` | Create policy | Admin |
| PUT | `/api/policies/:id` | Update policy | Admin |
| DELETE | `/api/policies/:id` | Delete policy | Admin |
| GET | `/api/faqs` | List FAQs | Public |
| POST | `/api/faqs` | Create FAQ | Admin |
| PUT | `/api/faqs/:id` | Update FAQ | Admin |
| DELETE | `/api/faqs/:id` | Delete FAQ | Admin |
| GET | `/api/circulus` | List circulars | Public |
| POST | `/api/circulus` | Create circular | Admin |
| PUT | `/api/circulus/:id` | Update circular | Admin |
| DELETE | `/api/circulus/:id` | Delete circular | Admin |
| GET | `/api/employees` | Paginated/filterable employee directory | Logged in |
| GET | `/api/employees/departments-list` | Distinct programme values | Logged in |
| GET | `/api/employees/skills-list` | Distinct skill values | Logged in |
| GET | `/api/employees/:id` | Single employee | Logged in |
| POST | `/api/employees` | Create employee | Admin |
| PUT | `/api/employees/:id` | Update employee | Admin |
| DELETE | `/api/employees/:id` | Deactivate employee (soft delete) | Admin |
| GET | `/api/departments` | List departments + live employee counts | Logged in |
| POST | `/api/departments` | Create department | Admin |
| PUT | `/api/departments/:id` | Update department | Admin |
| DELETE | `/api/departments/:id` | Deactivate department (blocked if active employees remain) | Admin |
| GET | `/api/users` | Legacy public directory (name/email/programme only) — unused by the current frontend | Public |
| GET | `/api/admin/news` | All news including Drafts | Admin |
| GET | `/api/admin/wellness` | All wellness videos including Drafts | Admin |
| GET | `/api/admin/users` | All accounts with role/status/last-login | Admin |
| PUT | `/api/admin/users/:id/role` | Change a user's role | Admin |
| PUT | `/api/admin/users/:id/status` | Activate/deactivate a user | Admin |
| POST | `/api/admin/users/invite` | Create an account for an existing employee, email them a password-set link | Admin |
| GET | `/api/admin/stats` | Dashboard counts | Admin |
| POST | `/api/auth/register` | Self-register (role always forced to `Employee`) | Public |
| POST | `/api/auth/login` | Log in, issue JWT | Public |
| POST | `/api/auth/forgot-password` | Request a reset link | Public |
| POST | `/api/auth/reset-password` | Consume a reset/invite token, set new password | Public |
| PUT | `/api/users/:id` | Update own profile | Owner/Admin |

## 2. Authentication

```
POST /api/auth/login
Content-Type: application/json

{ "email": "ungomane@ncdedat.gov.za", "password": "••••••••" }
```

**200 OK**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "employee_id": "1",
    "first_name": "Ursula Fezeka",
    "surname": "Ngomane",
    "email": "ungomane@ncdedat.gov.za",
    "role": "Admin",
    "is_active": true,
    "must_reset_password": false,
    "last_login_at": "2026-11-09T19:12:25.765Z"
  }
}
```
`password_hash` is explicitly stripped before the response is sent.
Errors: `400` missing fields, `401` wrong credentials, `403` deactivated
or pending-password-reset account.

Every authenticated request after this sends the token back:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

`POST /api/auth/register`, `/forgot-password`, `/reset-password` are
documented in full in [`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md).

## 3. Content endpoints (News, Circulars, FAQs, Policies, Documents, Wellness)

These six resources share one pattern: a public `GET` list (and, for
News/Documents/Policies/Wellness, a public `GET /:id`), and Admin-only
`POST`/`PUT`/`DELETE`. Example using News — the others differ only in
field names (see [`DATABASE_DOCUMENTATION.md`](DATABASE_DOCUMENTATION.md)
§2 for each table's columns):

```
POST /api/news
Authorization: Bearer <admin token>
Content-Type: application/json

{
  "title": "New Industrial Hub Launched",
  "content_markdown": "## Overview\n\nFull article body...",
  "category": "News",
  "excerpt": "A short summary shown in listings.",
  "author": "Communications Unit",
  "publication_date": "2026-11-10",
  "image_url": "https://example.org/banner.jpg",
  "is_featured": true,
  "status": "Published"
}
```

**201 Created** — returns the full inserted row, including generated
`id`, `created_date`, `updated_at`. **400** if `title` or
`content_markdown` is blank. **401** no token. **403** token belongs to a
non-Admin or a deactivated account.

`GET /api/news/:id` (no token) → `200` if `status = 'Published'`, `404`
if it's a `Draft` or doesn't exist. The same request **with** a valid
Admin token → `200` even for a `Draft` (lets an Admin preview their own
unpublished work). This is deliberately `404`, not `403`, so a Draft's
existence is never confirmed to someone who shouldn't see it.

Wellness additionally requires `video_url` to be non-empty on create/update
(`400` otherwise), and exposes one more endpoint:

```
POST /api/wellness/upload
Authorization: Bearer <admin token>
Content-Type: multipart/form-data; boundary=...

------boundary
Content-Disposition: form-data; name="video"; filename="clip.mp4"
Content-Type: video/mp4

<binary video bytes>
------boundary--
```

**201 Created**
```json
{ "url": "http://localhost:5000/uploads/videos/61ea9b7b-....mp4" }
```
Use that `url` as the `video_url` in a subsequent `POST`/`PUT
/api/wellness`. **400** if the file isn't `video/*` or exceeds 200MB.
Full detail in [`../NEWS_WELLNESS_GUIDE.md`](../NEWS_WELLNESS_GUIDE.md).

Calendar events have no `status`/Draft concept and allow **any
logged-in** user to `POST` (not just Admins — booking a meeting room is
an everyday action, not a publishing action):

```
POST /api/calendar-events
Authorization: Bearer <any valid token>

{
  "title": "Quarterly Planning Meeting",
  "start_time": "2026-11-20 09:00:00",
  "end_time": "2026-11-20 10:30:00",
  "category": "Boardroom",
  "quarter": "Q4"
}
```
`409 Conflict` if another `Boardroom`-category event overlaps the same
time window.

## 4. Employees

```
GET /api/employees?search=bez&department=ADMINISTRATION&status=Active&page=1&limit=10
Authorization: Bearer <any valid token>
```

**200 OK**
```json
{
  "data": [
    {
      "id": "2",
      "first_name": "Liesl Luane",
      "surname": "Bezuidenhout",
      "full_name": "Liesl Luane Bezuidenhout",
      "position": "Assistant Manager: Enterprise Development",
      "programme": "ADMINISTRATION",
      "department_id": "2",
      "is_mentor": false,
      "skills": ["Enterprise Development", "Management"],
      "status": "Active"
    }
  ],
  "pagination": {
    "currentPage": 1, "itemsPerPage": 10, "totalItems": 1,
    "totalPages": 1, "hasNext": false, "hasPrev": false
  }
}
```

```
POST /api/employees          (Admin)
{ "id": 999, "first_name": "Jane", "surname": "Doe", "department_id": 2 }
```
`id` must be supplied and not already exist (`409` if it does).

```
DELETE /api/employees/:id    (Admin)
```
**Soft delete** — sets `status = 'Inactive'`, never removes the row
(payroll/HR traceability). The linked `users` row, if any, is untouched.

## 5. Departments

```
GET /api/departments         (any logged-in user)
```
Returns every department with a live-computed `employee_count`
(`COUNT(*) FROM employees WHERE department_id = d.id AND status <>
'Inactive'`).

```
DELETE /api/departments/:id  (Admin)
```
`409 Conflict` if any active employee is still assigned — reassign or
deactivate them first; this endpoint never cascades.

## 6. Admin: users, roles, invites, stats

```
GET /api/admin/users         (Admin)
```
Returns every account with `role`, `is_active`, `must_reset_password`,
`last_login_at` — fields the public `/api/users` deliberately omits.

```
PUT /api/admin/users/:id/role     (Admin)
{ "role": "Admin" }
```
`400` if `role` isn't `Employee`/`Admin`. `409` if this would demote the
last active Admin.

```
PUT /api/admin/users/:id/status   (Admin)
{ "is_active": false }
```
`409` if this would deactivate the last active Admin.

```
POST /api/admin/users/invite      (Admin)
{ "employee_id": 42, "role": "Employee" }
```
Looks up the employee, creates an account with an unusable random
placeholder password hash and `must_reset_password: true`, emails (or, if
email isn't configured, logs to the server console) a one-time
password-set link. **409** if that employee already has an account.

```
GET /api/admin/stats          (Admin)
```
**200 OK**
```json
{
  "employees": { "active": 159, "total": 159 },
  "users": { "total": 1, "active": 1, "admins": 1 },
  "departments": { "active": 6, "total": 6, "breakdown": [
    { "name": "ADMINISTRATION", "employee_count": "82" }
  ]},
  "pendingRegistrations": 158,
  "recentNews": [ { "id": "13", "title": "...", "category": "News" } ]
}
```
`pendingRegistrations` = employees with no linked `users` row.

## 7. Profile

```
PUT /api/users/:id
Authorization: Bearer <token>
{ "first_name": "Jane", "surname": "Doe", "programme": "ADMINISTRATION" }
```
`403` unless the token's `id` matches `:id`, or the caller is an Admin —
previously any valid token could edit any profile by changing the URL.

## 8. Error shape

Every error response is `{ "error": "<human-readable message>" }` with an
appropriate HTTP status (`400`/`401`/`403`/`404`/`409`/`500`). There is no
separate machine-readable error code field.
