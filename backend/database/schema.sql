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