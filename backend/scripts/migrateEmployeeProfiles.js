/*
 * =========================================================
 * EMPLOYEE PROFILE BACKFILL
 * =========================================================
 *
 * The 159 employees in src/components/staff/staffData.js carry richer
 * profile data (skills, mentor flag, phone, location, experience) than
 * what importEmployees.js originally copied into PostgreSQL. This script
 * backfills those extra fields onto the EXISTING employees rows (matched
 * by id) so the Staff Directory can be served entirely from the database
 * instead of the hardcoded file, without re-creating or duplicating any
 * of the 159 records.
 *
 * Safe to re-run: it only ever updates rows that already exist.
 *
 * Usage: node scripts/migrateEmployeeProfiles.js
 * =========================================================
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const pool = require("../db");

function loadStaffData() {
    const filePath = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "components",
        "staff",
        "staffData.js"
    );

    let fileContent = fs.readFileSync(filePath, "utf8");

    fileContent = fileContent.replace(
        /^\s*export\s+(const|let|var)\s+/m,
        "$1 "
    );

    const match = fileContent.match(
        /(?:const|let|var)\s+staffData\s*=\s*(\[[\s\S]*\])/
    );

    if (!match) {
        throw new Error("Could not find 'staffData' array in staffData.js");
    }

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`staffData = ${match[1]}`, sandbox);

    return sandbox.staffData;
}

async function migrateEmployeeProfiles() {
    const employees = loadStaffData();

    console.log(`Found ${employees.length} employee profiles to backfill.`);

    let updated = 0;
    let skipped = 0;

    for (const employee of employees) {
        if (!employee.id) {
            skipped++;
            continue;
        }

        const result = await pool.query(
            `UPDATE employees
             SET
                full_name = COALESCE($1, full_name),
                initials = COALESCE($2, initials),
                phone = COALESCE($3, phone),
                location = COALESCE($4, location),
                is_mentor = COALESCE($5, is_mentor),
                skills = COALESCE($6, skills),
                experience = COALESCE($7, experience),
                updated_at = NOW()
             WHERE id = $8
             RETURNING id`,
            [
                employee.fullName || null,
                employee.initials || null,
                employee.phone || null,
                employee.location || null,
                typeof employee.isMentor === "boolean" ? employee.isMentor : null,
                Array.isArray(employee.skills) ? employee.skills : null,
                employee.experience || null,
                employee.id,
            ]
        );

        if (result.rowCount > 0) {
            updated++;
        } else {
            skipped++;
        }
    }

    console.log("--------------------------------");
    console.log("Employee profile backfill completed.");
    console.log(`Updated: ${updated}`);
    console.log(`Skipped (no matching row): ${skipped}`);
    console.log("--------------------------------");
}

migrateEmployeeProfiles()
    .catch((error) => {
        console.error("Employee profile backfill failed:", error);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
