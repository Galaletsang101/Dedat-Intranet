-- Lets the person who created a Boardroom booking manage it themselves
-- (edit or cancel) without needing Admin rights, in addition to the
-- existing Admin-can-cancel-anything power. Ownership has to be tracked
-- at creation time by the authenticated user's own id - never inferred
-- from the `organiser` display string, which is just a human-readable
-- name and not a safe identity check (two people can share a name, and
-- it's derived text, not a foreign key).
--
-- Nullable: historical rows created before this column existed have no
-- recorded owner, so only Admins can manage those - which is already
-- the correct/only behavior for them today.

ALTER TABLE calendar_events
    ADD COLUMN IF NOT EXISTS created_by BIGINT REFERENCES users(id);
