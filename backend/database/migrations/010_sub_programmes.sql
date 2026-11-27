-- Normalizes a parent-programme / sub-programme hierarchy under `departments`
-- ("programmes" in the UI). `employees.subprogramme` / `users.subprogramme`
-- are pre-existing free-text columns but are legacy/unused (0 of 159 real
-- employee rows have a non-blank value) - this table is the real source of
-- truth for sub-programmes going forward, managed by Admins via the UI.

CREATE TABLE IF NOT EXISTS sub_programmes (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (department_id, name)
);

-- Placeholder sub-programmes per real department, so the feature is
-- demonstrable immediately instead of starting empty. Admins can edit,
-- deactivate, or add more via the new UI afterward.
INSERT INTO sub_programmes (department_id, name, description, status)
SELECT d.id, v.name, v.description, v.status
FROM departments d
JOIN (VALUES
    ('ADMINISTRATION', 'Office of the HOD', 'Executive and strategic support to the Head of Department.', 'Active'),
    ('ADMINISTRATION', 'Financial Management', 'Budgeting, supply chain management and financial reporting.', 'Active'),
    ('ADMINISTRATION', 'Corporate Services', 'Human resources, legal services and administrative support.', 'Inactive'),
    ('ECONOMIC PLANNING', 'Integrated Economic Development Planning', 'Provincial economic planning and policy coordination.', 'Active'),
    ('ECONOMIC PLANNING', 'Research & Development', 'Economic research, data analysis and strategy development.', 'Active'),
    ('ECONOMIC PLANNING', 'Local Economic Development', 'Support for municipal-level economic development initiatives.', 'Inactive'),
    ('INTEGRATED ECONOMIC DEVELOPMENT SERVICES', 'Enterprise Development', 'Support services for emerging and established enterprises.', 'Active'),
    ('INTEGRATED ECONOMIC DEVELOPMENT SERVICES', 'Cooperatives Development', 'Formation and support of cooperatives across the province.', 'Active'),
    ('INTEGRATED ECONOMIC DEVELOPMENT SERVICES', 'Youth & SMME Support', 'Programmes targeting youth-owned and small business growth.', 'Active'),
    ('TRADE AND SECTOR DEVELOPMENT', 'Trade Development', 'Trade facilitation and export promotion support.', 'Active'),
    ('TRADE AND SECTOR DEVELOPMENT', 'Sector Development', 'Sector-specific growth strategies and interventions.', 'Active'),
    ('TRADE AND SECTOR DEVELOPMENT', 'Investment Promotion', 'Attracting and facilitating investment into the province.', 'Active'),
    ('TOURISM', 'Tourism Growth & Development', 'Growing the provincial tourism sector and product base.', 'Active'),
    ('TOURISM', 'Destination Marketing', 'Promotion of the Northern Cape as a tourism destination.', 'Active'),
    ('TOURISM', 'Tourism Safety Monitors', 'Visitor safety monitoring programme at tourism sites.', 'Inactive'),
    ('BUSINESS REGULATION & GOVERNANCE', 'Consumer Protection', 'Consumer protection compliance and awareness.', 'Active'),
    ('BUSINESS REGULATION & GOVERNANCE', 'Liquor Regulation', 'Licensing and regulation of liquor trade.', 'Active'),
    ('BUSINESS REGULATION & GOVERNANCE', 'Gambling & Racing Governance', 'Regulatory oversight of gambling and racing activities.', 'Active')
) AS v(department_name, name, description, status)
    ON v.department_name = d.name
ON CONFLICT (department_id, name) DO NOTHING;
