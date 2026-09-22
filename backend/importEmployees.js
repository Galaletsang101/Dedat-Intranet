const fs = require("fs");
const path = require("path");
const vm = require("vm");
const pool = require("./db");

async function importEmployees() {
    try {
        const filePath = path.join(
            __dirname,
            "..",
            "src",
            "components",
            "staff",
            "staffData.js"
        );

        console.log("Reading:", filePath);

        let fileContent = fs.readFileSync(filePath, "utf8");

        // Remove ES module export if present
        fileContent = fileContent.replace(
            /^\s*export\s+(const|let|var)\s+/m,
            "$1 "
        );

        // Find the array assigned to staffData
        const match = fileContent.match(
            /(?:const|let|var)\s+staffData\s*=\s*(\[[\s\S]*\])/
        );

        if (!match) {
            throw new Error(
                "Could not find 'staffData' array in staffData.js"
            );
        }

        const sandbox = {};
        vm.createContext(sandbox);

        vm.runInContext(
            `staffData = ${match[1]}`,
            sandbox
        );

        const employees = sandbox.staffData;

        console.log(`Found ${employees.length} employees.`);

        let imported = 0;
        let skipped = 0;

        for (const employee of employees) {
            if (
                !employee.id ||
                !employee.firstName ||
                !employee.lastName
            ) {
                console.log(
                    "Skipping incomplete employee:",
                    employee
                );
                skipped++;
                continue;
            }

            const existing = await pool.query(
                "SELECT id FROM employees WHERE id = $1",
                [employee.id]
            );

            if (existing.rows.length > 0) {
                skipped++;
                continue;
            }

            await pool.query(
                `INSERT INTO employees
                (
                    id,
                    first_name,
                    surname,
                    email,
                    programme,
                    subprogramme,
                    position,
                    created_date
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [
                    employee.id,
                    employee.firstName,
                    employee.lastName,
                    employee.email || null,
                    employee.programme || null,
                    employee.subprogramme || null,
                    employee.jobTitle || null
                ]
            );

            imported++;
        }

        console.log("--------------------------------");
        console.log("Employee import completed.");
        console.log(`Imported: ${imported}`);
        console.log(`Skipped: ${skipped}`);
        console.log(`Total found: ${employees.length}`);
        console.log("--------------------------------");

    } catch (error) {
        console.error("Employee import failed:", error);
    } finally {
        await pool.end();
    }
}

importEmployees();