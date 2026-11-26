-- Boardroom bookings previously had no record of who organised the
-- booking or how many people / what equipment it needed. The old
-- frontend form free-typed an "organiser" string and the backend would
-- have trusted whatever the client sent - inconsistent with this app's
-- "never trust the client for anything identity-related" convention
-- (see requireRole in backend/middleware/auth.js, which re-reads role/
-- is_active from Postgres on every request instead of trusting the
-- JWT). The server now derives organiser itself from the authenticated
-- user's own row. attendees/requirements are optional booking details,
-- relevant only to Boardroom-category events; both stay nullable so the
-- generic Meeting/Training/Leave/Deadline rows created via
-- AddContent.jsx are unaffected.

ALTER TABLE calendar_events
    ADD COLUMN IF NOT EXISTS organiser TEXT NOT NULL DEFAULT '';

ALTER TABLE calendar_events
    ADD COLUMN IF NOT EXISTS attendees INTEGER;

ALTER TABLE calendar_events
    ADD COLUMN IF NOT EXISTS requirements TEXT;
