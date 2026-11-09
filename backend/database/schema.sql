CREATE TABLE IF NOT EXISTS employees (
    id BIGINT PRIMARY KEY,
    first_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT,
    programme TEXT,
    subprogramme TEXT,
    position TEXT,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL UNIQUE REFERENCES employees(id),
    first_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    programme TEXT,
    subprogramme TEXT,
    position TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Employee',
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content_markdown TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'News',
    author TEXT NOT NULL DEFAULT '',
    publication_date DATE,
    image_url TEXT NOT NULL DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS wellness_videos (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Mental Health',
    duration TEXT NOT NULL DEFAULT '',
    thumbnail TEXT NOT NULL DEFAULT '',
    video_url TEXT NOT NULL DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL DEFAULT 'Meeting',
    quarter TEXT
);

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'DOCUMENT',
    keywords TEXT NOT NULL DEFAULT '',
    knowledge_owner TEXT,
    publication_date DATE,
    review_date DATE,
    version_number TEXT NOT NULL DEFAULT 'v1.0',
    status TEXT NOT NULL DEFAULT 'Published',
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policies (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    policy_number TEXT,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Policy',
    author TEXT,
    publication_date DATE,
    review_date DATE,
    status TEXT NOT NULL DEFAULT 'draft',
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    keywords TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS circulus (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Circulars',
    author TEXT,
    publication_date DATE,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    content JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO calendar_events (title, description, start_time, end_time, category)
SELECT holiday.title, 'Public holiday', holiday.start_time, holiday.end_time, 'Holiday'
FROM (VALUES
    ('New Year''s Day', TIMESTAMPTZ '2026-01-01 00:00:00+02', TIMESTAMPTZ '2026-01-01 23:59:00+02'),
    ('Human Rights Day', TIMESTAMPTZ '2026-03-21 00:00:00+02', TIMESTAMPTZ '2026-03-21 23:59:00+02'),
    ('Good Friday', TIMESTAMPTZ '2026-04-03 00:00:00+02', TIMESTAMPTZ '2026-04-03 23:59:00+02'),
    ('Family Day', TIMESTAMPTZ '2026-04-06 00:00:00+02', TIMESTAMPTZ '2026-04-06 23:59:00+02'),
    ('Freedom Day', TIMESTAMPTZ '2026-04-27 00:00:00+02', TIMESTAMPTZ '2026-04-27 23:59:00+02'),
    ('Workers'' Day', TIMESTAMPTZ '2026-05-01 00:00:00+02', TIMESTAMPTZ '2026-05-01 23:59:00+02'),
    ('Youth Day', TIMESTAMPTZ '2026-06-16 00:00:00+02', TIMESTAMPTZ '2026-06-16 23:59:00+02'),
    ('National Women''s Day', TIMESTAMPTZ '2026-08-09 00:00:00+02', TIMESTAMPTZ '2026-08-09 23:59:00+02'),
    ('Heritage Day', TIMESTAMPTZ '2026-09-24 00:00:00+02', TIMESTAMPTZ '2026-09-24 23:59:00+02'),
    ('Day of Reconciliation', TIMESTAMPTZ '2026-12-16 00:00:00+02', TIMESTAMPTZ '2026-12-16 23:59:00+02'),
    ('Christmas Day', TIMESTAMPTZ '2026-12-25 00:00:00+02', TIMESTAMPTZ '2026-12-25 23:59:00+02'),
    ('Day of Goodwill', TIMESTAMPTZ '2026-12-26 00:00:00+02', TIMESTAMPTZ '2026-12-26 23:59:00+02')
) AS holiday(title, start_time, end_time)
WHERE NOT EXISTS (
    SELECT 1
    FROM calendar_events existing
    WHERE existing.category = 'Holiday'
      AND existing.title = holiday.title
      AND existing.start_time = holiday.start_time
);
