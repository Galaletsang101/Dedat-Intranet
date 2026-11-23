-- Departments previously existed only as free-text `programme` strings on
-- employees/users. This gives Admins a real, manageable entity while
-- keeping the existing text columns intact (nothing reads department_id yet
-- except new admin endpoints, so this is additive and safe).

CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed departments from the programmes already present on real employee
-- records, so nothing has to be re-entered by hand.
INSERT INTO departments (name)
SELECT DISTINCT TRIM(programme)
FROM employees
WHERE programme IS NOT NULL AND TRIM(programme) <> ''
ON CONFLICT (name) DO NOTHING;

-- Link each employee to their department row by matching programme name.
UPDATE employees e
SET department_id = d.id
FROM departments d
WHERE e.department_id IS NULL
  AND TRIM(e.programme) = d.name;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'employees_department_id_fkey'
    ) THEN
        ALTER TABLE employees
            ADD CONSTRAINT employees_department_id_fkey
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;
    END IF;
END $$;
