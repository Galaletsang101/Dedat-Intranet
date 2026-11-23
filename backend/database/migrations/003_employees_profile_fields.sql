-- Extends `employees` with the directory/profile fields that previously
-- only existed in the hardcoded src/components/staff/staffData.js file, so
-- the Staff Directory and Employee Management screens can be fully
-- database-backed. Existing 159 rows and their primary keys are untouched.

ALTER TABLE employees
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS initials TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS location TEXT,
    ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS skills TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS experience TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active',
    ADD COLUMN IF NOT EXISTS department_id BIGINT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'employees_status_check'
    ) THEN
        ALTER TABLE employees
            ADD CONSTRAINT employees_status_check CHECK (status IN ('Active', 'Inactive'));
    END IF;
END $$;

-- Backfill a reasonable default so existing rows aren't left NULL.
UPDATE employees
SET full_name = TRIM(first_name || ' ' || surname)
WHERE full_name IS NULL;
