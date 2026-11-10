# End User Guide

A practical manual for using the DEDaT Intranet — written for staff, not
developers. Admin-only steps are clearly marked; everything else applies
to every logged-in staff member.

## 1. Logging in

1. Open the intranet in your browser.
2. Enter your government email (`name@ncdedat.gov.za`) and password.
3. Click **Login**.

If you don't have an account yet, click **Sign Up** — you can only
self-register if your employee record already exists in the system
(ask your Admin if registration says your employee record wasn't found).

**Forgot your password?** Click **Forgot Password** on the login screen,
enter your email, and a reset link will be sent to you (or, if your
organization hasn't configured email yet, ask your IT administrator for
it). The reset page asks for a new password (minimum 8 characters) twice.

## 2. Logging out

Click your name/initials in the top-right corner, then **Logout**.
Closing the browser tab also ends your session — logins don't persist
across browser restarts by design.

## 3. Navigating the application

The top navigation bar links to every page you have access to: Home,
About, Calendar, News and Circulars, Programs and Units, Staff Directory,
Knowledge Center, Dashboard. The orange bar underneath holds shortcut
buttons (Policies, Wellness, Help Desk, and a few links to external
systems). If you're an Admin, you'll also see **Admin Center** and
**Add Content**.

## 4. Reading News and Circulars

Go to **News and Circulars**. The featured story appears as a large
banner at the top; everything else is shown as cards below it. Use the
category filters (All/News/Circulars/Events/Training) or the search box
to narrow things down. Click any article's title or image to open the
**full article** — not just a summary — with the complete story, image,
author, and publish date. Official circulars and gazettes are listed
separately below the news grid, each with a button to view/download the
PDF.

## 5. Viewing employee information (Staff Directory)

Go to **Staff Directory**. Search by name, skill, or programme, or use
the filter dropdowns (department, skill category) and the "Mentor Only"
switch. Each result card shows the person's role, department, skills,
and a **Contact** button that opens an email to them, plus a **Copy
Email** button.

## 6. Wellness videos

Go to **Wellness**. Browse or search the webinar library, filter by
category (Mental Health / Productivity / Physical Care), and click
**Watch Now** on any video card to open it in a player. Videos either
play directly or open as an embedded YouTube/Vimeo player, depending on
how the Admin added them — either way, press play yourself; nothing
autoplays with sound. Close the player with the **✕** button or by
pressing Escape.

## 7. Reading Policies, FAQ, and the Knowledge Centre

- **Policies** — browse official policy documents; each one links to its
  PDF.
- **FAQ** — questions are grouped by category; expand a question to read
  its answer.
- **Knowledge Center** — guides and resources, each with a description
  and an attached document.

## 8. Calendar and boardroom booking

Go to **Calendar**. Browse events by month, filter by category, and
search by title. Click any day to open the booking form — fill in a
title, start/end time, and category, then save. **Any staff member can
book the boardroom** (it's a shared resource, not an Admin-only action) —
the system automatically rejects a booking that overlaps an existing
boardroom booking for the same time slot.

## 9. Your profile

Click your name in the top-right, then **View Profile**. You can update
your own first name, surname, programme, sub-programme, and position.
You cannot change your own role or email from here — contact an Admin
for either.

## 10. Programmes & Units

Shows each department's real information (name, description, how many
employees are currently assigned) — the data here comes directly from
what Admins manage in Admin Center → Departments, so it's always current.

---

## For Admins: managing content and the organization

Everything above still applies to you — this section covers what's
*additionally* available once your account has the Admin role.

### 11. Add Content

Click **Add Content** (bottom nav bar). Pick a content type on the left
(News & Circulars, FAQ, Knowledge Centre, Policies, Wellness, Calendar
Event), fill in the form, and click **Publish**. Long-text fields use a
formatting toolbar (bold, italic, headings, lists, links) — no need to
know Markdown. Every type except Calendar Events has a **Visibility**
setting: choose **Draft** to save it without showing it to staff yet, or
**Published** to make it visible immediately. Two quick-link buttons at
the top jump straight to managing Employees or Departments instead.

Below the News and Wellness forms, a **Manage Existing...** table lists
everything already published (including Drafts) with buttons to **Edit**,
**Publish/Unpublish**, or **Delete** each item.

### 12. Admin Center

Click **Admin Center** (top or bottom nav). Four tabs:

- **Overview** — live counts: active employees, active accounts,
  departments, and how many employees don't have a login yet.
- **Employees** — search/filter the full directory, add a new employee,
  edit an existing one, or deactivate one (deactivating keeps their
  history, it doesn't delete them).
- **Users & Roles** — see every account, change someone's role
  (Employee ↔ Admin), activate/deactivate an account, or **Invite User**
  to create an account for an existing employee (they'll get an emailed
  link to set their own password — you never choose it for them).
- **Departments** — add, edit, or deactivate departments. A department
  with active employees still assigned can't be deactivated until they're
  reassigned.

Full step-by-step Admin workflows:
[`ADMIN_USER_GUIDE.md`](ADMIN_USER_GUIDE.md)

## Notes on what's not yet available

The **Dashboard** page's HR Services, Wellness Center links, Notices, and
Quick Action buttons are placeholders carried over from an early design —
they don't connect to any real system yet (the Anonymous Suggestion/
Grievance boxes accept text and show a confirmation message, but nothing
is actually sent or stored). There's no leave-management or approvals
feature in this version of the intranet.
