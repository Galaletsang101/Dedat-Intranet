# News, Wellness & Date Handling

Covers the full-article reading experience, Wellness video upload/playback,
the centralized date utility, and the Draft/Published content workflow.

## 1. The "Invalid Date" bug: root cause and fix

**Root cause.** The News & Circulars page (`src/components/news/newspage_Component.jsx`)
read `item.publish_date` and `item.date_published` from the API response.
Neither field exists - the `news` table's actual column is
`publication_date`, and `circulus`'s is also `publication_date`. So
`new Date(undefined)` produced an `Invalid Date` object, and the page
called `.toLocaleDateString()` on it with **no validity check at all**,
printing the literal string `"Invalid Date"` to every visitor. A second,
quieter version of the same mistake existed in `KnowledgeCenter.jsx`,
`Policies.jsx`, `Profile.jsx`, and two admin pages, each with its own
slightly-different hand-rolled `new Date(x).toLocaleDateString()` call -
duplicated logic, each one a fresh opportunity for the same bug.

**Fix.** `src/utils/dateUtils.js` is now the single place date formatting
happens:

- `parseDate(value)` - returns a real `Date` or `null`, never an Invalid
  Date object. Handles `null`/`undefined`/`""`, already-a-`Date`,
  PostgreSQL `TIMESTAMPTZ` strings (left to the native parser, which
  handles timezone offsets correctly), and PostgreSQL `DATE`-only strings
  (`"2026-01-15"`) specially - those are parsed as **local calendar
  components**, not UTC midnight, so the displayed day never shifts
  backward a day for viewers in a negative-UTC-offset timezone. Also
  rejects out-of-range values that the native `Date` constructor would
  otherwise silently roll over into some unrelated future date (e.g.
  `"2026-99-99"`).
- `formatDate(value, fallback = "Date unavailable")` - date-only display.
- `formatDateTime(value, fallback)` - date + time.
- `formatRelative(value, fallback)` - "Today" / "Yesterday" / "N days ago",
  falling back to `formatDate()` beyond a week.

None of these can ever return the string `"Invalid Date"` - this is
covered directly by `src/utils/dateUtils.test.js` (19 tests, including the
exact timezone-shift scenario described above). Every date display found
in the app (News, Circulars, Wellness, Knowledge Centre, Policies,
Profile, Admin Overview, Admin Users' last-login) now routes through this
module instead of its own inline `new Date(...).toLocaleDateString()`.

## 2. Full article reading page

`GET /api/news` (list) and the News & Circulars page only ever showed a
title/excerpt - there was no way to read the full `content_markdown`.

- **New route:** `/#/news/:id` → `src/pages/NewsArticle.jsx`. Shows the
  complete article: featured image, category, date, author, full content
  (rendered via `ReactMarkdown` - the same library already used
  elsewhere, which does **not** render raw HTML by default, so this stays
  safe from injected markup/script without needing a separate sanitizer),
  and a back-to-listing link. Has loading, "not found", and Draft-preview
  states.
- **New backend endpoint:** `GET /api/news/:id`. Published articles are
  public; a Draft article 404s (not 403, to avoid confirming it exists)
  for anyone who isn't an Admin.
- Every "Read Article" / "Read Full Article" link across the Homepage and
  News & Circulars page now actually navigates there - previously the
  Homepage's grid link was a literal `href="#"` that did nothing.

## 3. Draft / Published workflow

`news` and `wellness_videos` gained a `status` column
(`migrations/006_news_wellness_publishing.sql`), defaulting every
existing row to `'Published'` so nothing already live changed visibility.

- `GET /api/news` and `GET /api/wellness` (the public listings) only ever
  return `status = 'Published'`.
- `GET /api/admin/news` / `GET /api/admin/wellness` (Admin-only) return
  everything, including Drafts - these back the **Manage Existing
  Articles** / **Manage Existing Videos** tables shown under the News and
  Wellness forms in Add Content.
- Admins can toggle Published ⇄ Draft per item from that table, or from
  the create form's **Visibility** field.

## 4. Wellness videos: upload, storage, and playback

**What was broken.** The "Upload a Video File" control in Add Content
never actually uploaded anything - it called
`URL.createObjectURL(file)` and saved that `blob:` URL straight into
`wellness_videos.video_url`. A `blob:` URL is only ever valid in the
browser tab that created it; it doesn't survive a page refresh and was
never visible to any other viewer. Every Admin-uploaded video file was
silently broken for everyone except, briefly, the Admin's own tab.

**Fix - real server-side storage.**

- `POST /api/wellness/upload` (Admin-only, `multer` disk storage) saves
  the file to `backend/uploads/videos/<uuid>.<ext>`, validates it's an
  actual video (`mimetype` starts with `video/`), caps it at 200MB, and
  returns a real, permanent, absolute URL
  (`http://<host>/uploads/videos/<uuid>.<ext>`) served by
  `express.static` from that same directory. `backend/uploads/` is
  gitignored - uploaded files live only on the server's disk, not in the
  repository.
- The frontend (`src/services/wellnessService.js`'s
  `uploadWellnessVideoFile()`) uploads via `XMLHttpRequest` (not `fetch`)
  specifically so upload progress can be shown for large files - Add
  Content and the Wellness edit modal both show a progress bar.
- The video file field and the "paste a video link" field were
  previously backed by the **same** state variable, so selecting a file
  overwrote whatever had been typed as a link and vice versa, and the
  in-form preview of a selected file (a `blob:` URL, fine for a same-tab
  preview) was being conflated with the value actually sent to the
  backend. These are now two separate pieces of state - the preview
  `blob:` URL never reaches the database.

**Playback: YouTube, Vimeo, and direct files.** `src/components/VideoPlayer.jsx`
(backed by `src/utils/videoUtils.js`, unit-tested in
`VideoPlayer.test.jsx`) detects the source type and renders accordingly:

- YouTube (`youtube.com/watch?v=`, `youtu.be/`, `/shorts/`) → a responsive
  `youtube-nocookie.com/embed/...` iframe.
- Vimeo (`vimeo.com/<id>`) → a responsive `player.vimeo.com/video/...`
  iframe.
- Anything else (including our own uploaded-file URLs) → a plain
  `<video controls>` element.
- Never autoplays with sound in any case - direct files get no `autoplay`
  attribute, and embed URLs never pass `autoplay=1`. On playback error,
  shows a fallback message instead of a broken/blank player.

## 5. News section redesign

`src/components/news/newspage_Component.jsx` previously used its own,
differently-styled card markup (`.news-card-item`, bootstrap-only
classes) with a hardcoded fake "Digital Newsletters" archive (4 invented
Google-hosted image URLs) and broken circulus field names
(`item.tittle`, `item.date_published`, `item.circulus_number` - none of
which exist on the `circulus` table; the real columns are `title`,
`publication_date`, and there is no circular-number column at all).

It's rewritten to reuse the **same** `.news-card` / `.news-category` /
`.news-title` / `.news-excerpt` / `.news-read-link` classes from
`homepage.css` that the Homepage's "Latest Departmental News" section
already uses, so the two pages visually match. The fabricated newsletter
archive was removed (dead decorative feature, not backed by any table or
business requirement); the circulars section now reads the correct
column names and links out to each circular's real `file_url`. Loading
skeletons and an empty state were added; Homepage and News & Circulars
both show a genuine "no news yet" state instead of hardcoded fallback
articles when the database is empty (the previous hardcoded
`carouselItems`/`newsItems`/`circulars` fallback arrays in `home.jsx`
were removed for the same reason `contentStorage.js` was removed earlier
- using invented content as a stand-in for missing database data).

## 6. Admin content management

Add Content (`/#/add-content`) already handled *creating* News and
Wellness content. It had no way to edit, publish/unpublish, or delete
something already created. `src/components/admin/NewsManager.jsx` and
`WellnessManager.jsx` are mounted below their respective forms and
provide a table (search is implicit - the list is typically short) with
Edit / Publish-Unpublish / Delete per item, reusing the same
`AdminModal`, `RichTextEditor`, and admin table styling already
established for Employees/Departments/Users. Edit opens a modal with the
item's current values pre-filled; a Wellness edit can also replace the
video file entirely.

## 7. Mobile responsiveness

`src/styles/wellness.css` had zero `@media` breakpoints - fixed 70px side
padding and a fixed 320px-wide search input caused horizontal overflow on
any phone-width viewport (verified: `document.documentElement.scrollWidth
> clientWidth` at 375px). Added breakpoints at 992px (video grid 3→2
columns), 768px (video grid →1 column, side padding reduced, search input
full-width, library header stacks), and 480px (tighter card padding).
Verified no horizontal overflow remains on News, the article detail page,
or Wellness at a 375px viewport.

## 8. Testing

```
cd backend && npm test   # includes tests/newsWellnessPublishing.test.js
                          # (13 tests: draft visibility, single-article/
                          #  video 404-vs-200 by role, upload validation)
                          # and tests/news.test.js (excerpt/author/image_url
                          #  NOT NULL regression)
npm test                 # includes dateUtils.test.js (19 tests) and
                          # VideoPlayer.test.jsx (9 tests)
```

All verified live via headless-browser testing: login → News & Circulars
(no "Invalid Date", hero + cards render) → open a full article (title,
image, full body, author, date all present) → Wellness (video card date
correct, modal opens a working `<iframe>`/`<video>`) → Add Content →
upload a real video file → confirm it's saved to disk, served with a real
URL, and appears live on the public Wellness page - the exact workflow
that was broken before this fix. Also re-verified the existing Admin RBAC
suite (prior work) stayed green throughout.

## 9. New environment / configuration

None. `backend/uploads/` is created automatically on server start
(`fs.mkdirSync(..., { recursive: true })`) and requires no new
environment variable - it's a local directory on the server's disk. In a
future multi-server or containerized deployment, this directory would
need to be on shared/persistent storage (or swapped for an object-storage
backend) since it currently assumes a single backend instance with a
persistent local disk.
