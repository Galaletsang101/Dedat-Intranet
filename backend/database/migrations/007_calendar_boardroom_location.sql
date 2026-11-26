-- Boardroom bookings previously had no room identifier, so the conflict
-- check in POST /api/calendar-events compared ALL "Boardroom" category
-- events against each other regardless of which room was meant - booking
-- Augrabies at 10:00 would block booking Flamingo at 10:00 the same day.
-- Adding `location` lets the backend scope the double-booking check to the
-- same room, and lets the UI show which of the department's boardrooms is
-- actually booked.

ALTER TABLE calendar_events
    ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
