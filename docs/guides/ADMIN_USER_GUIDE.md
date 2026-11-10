# Admin & Content Management Guide

Detailed Admin workflows. Assumes you're already logged in with an
Admin-role account — see [`END_USER_GUIDE.md`](END_USER_GUIDE.md) for
login/navigation basics, and
[`../ADMIN_GUIDE.md`](../ADMIN_GUIDE.md) for how the Admin role itself is
configured and enforced.

## 1. Managing user accounts

**Admin Center → Users & Roles.**

- **View all accounts:** the table shows every registered user, their
  role, active/inactive status, and when they last logged in.
- **Change a role:** use the Role dropdown directly in the table row.
  You cannot change your own role (the dropdown is disabled on your own
  row), and the system will refuse to demote the last remaining Admin —
  promote someone else first.
- **Activate / deactivate an account:** click the button in the Actions
  column, then **Confirm**. A deactivated account can't log in at all,
  even with the correct password. Same last-Admin protection applies to
  deactivation.
- **Invite a new user:** click **Invite User**, enter the employee's
  email (they must already exist in the employee directory) and choose
  their role, then **Send Invite**. This creates their account with no
  usable password and emails them a one-time link to set their own — if
  email isn't configured yet, ask your IT administrator to check the
  backend server's console output for the link instead.

## 2. Managing employees

**Admin Center → Employees.**

- **Search/filter:** type in the search box (matches name, position,
  programme, email, or skill), or use the Department/Status dropdowns.
- **Add an employee:** click **Add Employee**. You must supply a unique
  numeric ID (this matches how the original 159-person dataset was
  structured) along with name, position, department, and other details.
- **Edit an employee:** click **Edit** on their row, update any field,
  **Save Changes**. If they already have a login account, their name and
  position there update automatically to match.
- **Deactivate an employee:** click **Deactivate**, then **Confirm**.
  This is a **soft delete** — their record and history are preserved
  (including any linked login account), they just stop appearing in the
  active directory and employee counts.

## 3. Managing departments

**Admin Center → Departments.**

- **Add:** click **Add Department**, enter a name and optional
  description.
- **Edit:** click **Edit** on a row.
- **Deactivate:** click **Deactivate**. If any active employee is still
  assigned to that department, the system blocks this and tells you to
  reassign or deactivate them first — a department is never silently
  orphaned.

## 4. Managing News

**Add Content → News & Circulars** to create; the **Manage Existing
Articles** table underneath it (or directly reachable by selecting News
in Add Content) to edit/publish/delete.

1. Fill in Title, Category, Author, Published Date, a short Summary, an
   optional Image Link, and whether it should be **Featured** (shown
   prominently on the Homepage and News page).
2. Write the full story in the formatting toolbar editor.
3. Choose **Visibility**: Draft (only you can see/preview it) or
   Published (visible to everyone immediately).
4. **Preview** to check how it'll look, then **Publish**.
5. To change something later: find it in **Manage Existing Articles**,
   click **Edit**, make changes, **Save Changes**. **Unpublish** flips a
   live article back to Draft without deleting it. **Delete** removes it
   permanently (after a confirmation step).

Selecting **Circulars** as the category on the News form routes it to
the separate Circulars list instead of the main News feed — both are
managed from the same form.

## 5. Managing Wellness videos

**Add Content → Wellness** to create; **Manage Existing Videos**
underneath it to edit/publish/delete.

1. Fill in Title, Category, Description, and Published Date.
2. Provide the video one of two ways:
   - **Paste a link** — a YouTube or Vimeo URL plays as an embedded
     player; any other direct video file URL plays directly.
   - **Upload a file** — choose a video file (up to 200MB). It's
     uploaded to the server as you publish, with a progress bar; once
     done, it's stored permanently and plays for every viewer (this is
     different from, and fixes, an earlier version of this feature where
     uploaded files only ever played in the uploader's own browser tab).
3. Optionally add a thumbnail image link and mark it **Featured** (shows
   a "NEW" badge).
4. Choose **Visibility**, then **Publish**.
5. To replace a video later: **Edit** it in **Manage Existing Videos** —
   you can paste a new link or upload a replacement file, which fully
   replaces the old one.

## 6. Managing Policies, Knowledge Centre resources, and FAQs

Same **Add Content** pattern as News/Wellness: pick the type on the
left, fill in the fields, **Preview**, **Publish**. Policies and
Knowledge Centre items require attaching a PDF file. FAQs let you add a
new category on the fly via **+ New Category** if the existing list
doesn't fit. These three types don't currently have their own
"Manage Existing" table the way News/Wellness do — editing/removing one
after publishing requires asking a developer, or using the equivalent API
endpoint directly (see
[`../technical/API_DOCUMENTATION.md`](../technical/API_DOCUMENTATION.md)) —
noted in
[`../support/KNOWN_ISSUES.md`](../support/KNOWN_ISSUES.md) as a gap.

## 7. Monitoring the dashboard (Admin Center → Overview)

Shows: active employee count, active account count, department count
(with a breakdown by department), how many employees don't have a login
account yet ("pending registrations"), and the 5 most recent news items.
All of it is live, computed directly from the database on every page
load — nothing here is cached or manually updated.

## 8. Things that require developer/server access, not just the Admin role

- Configuring email delivery (`EMAIL_USER`/`EMAIL_PASSWORD` in
  `backend/.env`).
- Creating the very first Admin account on a brand-new installation
  (`npm run provision:admin`) — once at least one Admin exists, every
  subsequent Admin can be created through Users & Roles → Invite User
  without touching the server.
- Database backups/restores (see
  [`../support/BACKUP_AND_RECOVERY.md`](../support/BACKUP_AND_RECOVERY.md)).
- Applying a new database migration after a code update
  (`npm run migrate`).
