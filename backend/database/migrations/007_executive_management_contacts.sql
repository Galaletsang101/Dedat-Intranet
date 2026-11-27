-- Refresh the existing executive employee records with the contact details
-- supplied in the management directory, and add the two ministry contacts
-- that are not already represented in the employee roster.

UPDATE employees AS employee
SET
    first_name = contacts.first_name,
    surname = contacts.surname,
    full_name = contacts.full_name,
    email = contacts.email,
    phone = contacts.phone,
    position = contacts.position,
    updated_at = NOW()
FROM (VALUES
    (3::BIGINT, 'Lizette', 'Wyngaard', 'Lizette Wyngaard', 'mmusa@ncpg.gov.za', '053 839 4076', 'Chief Director: Administration'),
    (4::BIGINT, 'Thami', 'Mabija', 'Thami Mabija', 'UNgomane@ncpg.gov.za', '053 839 4002', 'Head of Department'),
    (6::BIGINT, 'Tebogo', 'Ngamole', 'Tebogo Ngamole', 'tngamole@ncpg.gov.za', '083 631 6507', 'Chief Director: Corporate Services'),
    (32::BIGINT, 'Prince', 'Olivier', 'Adv. Prince Olivier', 'POlivier@ncpg.gov.za', '082 812 5617', 'Chief Director: Consumer Protection'),
    (36::BIGINT, 'Sam', 'Mabilo', 'Mr. Sam Mabilo', 'smabilo@ncpg.gov.za', '053 830 4864', 'Chief Director: Economic Planning'),
    (49::BIGINT, 'Darryl', 'Christians', 'Mr. Darryl Christians', 'dchristians@ncpg.gov.za', '053 802 1646', 'Chief Director: IEDS'),
    (66::BIGINT, 'Riaan', 'Warie', 'Mr. Riaan Warie', 'rwarie@ncpg.gov.za', '053 830 4899', 'Chief Director: Trade & Sector Development'),
    (80::BIGINT, 'Zahid', 'Cader', 'Zahid Cader', 'caderzah@gmail.com', '067 012 1049', 'Chief Financial Officer'),
    (124::BIGINT, 'Jean', 'Wilson', 'Ms. Jean Wilson', 'jwilson@ncpg.gov.za', '053 830 4895', 'Chief Director: Tourism')
) AS contacts(id, first_name, surname, full_name, email, phone, position)
WHERE employee.id = contacts.id;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM employees
        WHERE (id = 160 AND COALESCE(LOWER(email), '') <> 'diceletselebe@yahoo.com')
           OR (id = 161 AND COALESCE(LOWER(email), '') <> 'kgalalelomatsime@gmail.com')
    ) THEN
        RAISE EXCEPTION 'Employee IDs 160 and 161 are already assigned to other employees';
    END IF;
END $$;

INSERT INTO employees (
    id,
    first_name,
    surname,
    full_name,
    initials,
    email,
    phone,
    programme,
    position
)
VALUES
    (160, 'Modise', 'Letselebe', 'Modise Letselebe', 'ML', 'diceletselebe@yahoo.com', '073 662 7454', 'OFFICE OF THE MINISTRY', 'Head of Ministry'),
    (161, 'Kgalalelo', 'Matsime', 'Kgalalelo Matsime', 'KM', 'kgalalelomatsime@gmail.com', '072 516 0182', 'OFFICE OF THE MINISTRY', 'Media Liaison Officer: Ministry')
ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    surname = EXCLUDED.surname,
    full_name = EXCLUDED.full_name,
    initials = EXCLUDED.initials,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    programme = EXCLUDED.programme,
    position = EXCLUDED.position,
    updated_at = NOW();
