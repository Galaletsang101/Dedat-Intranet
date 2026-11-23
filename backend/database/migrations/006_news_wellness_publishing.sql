-- Adds a Draft/Published workflow to news and wellness_videos, so Admins
-- can unpublish content without deleting it, and so an in-progress article
-- isn't visible to ordinary staff while it's being written. Every existing
-- row defaults to 'Published', preserving current visible behavior.

ALTER TABLE news
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Published';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'news_status_check'
    ) THEN
        ALTER TABLE news
            ADD CONSTRAINT news_status_check CHECK (status IN ('Published', 'Draft'));
    END IF;
END $$;

ALTER TABLE wellness_videos
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Published',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'wellness_videos_status_check'
    ) THEN
        ALTER TABLE wellness_videos
            ADD CONSTRAINT wellness_videos_status_check CHECK (status IN ('Published', 'Draft'));
    END IF;
END $$;
