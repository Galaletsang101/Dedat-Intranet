/*
 * =========================================================
 * MIGRATION RUNNER
 * =========================================================
 *
 * Applies every .sql file in backend/database/migrations, in filename
 * order, exactly once. Already-applied versions are recorded in
 * `schema_migrations` so re-running this script is always safe.
 *
 * Usage: npm run migrate   (from backend/)
 * =========================================================
 */

const fs = require("fs");
const path = require("path");
const pool = require("../db");

const MIGRATIONS_DIR = path.join(__dirname, "..", "database", "migrations");

async function ensureMigrationsTable(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);
}

async function runMigrations() {
    const client = await pool.connect();

    try {
        await ensureMigrationsTable(client);

        const appliedResult = await client.query(
            "SELECT version FROM schema_migrations"
        );
        const applied = new Set(appliedResult.rows.map((row) => row.version));

        const files = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        let appliedCount = 0;

        for (const file of files) {
            if (applied.has(file)) {
                console.log(`Skipping (already applied): ${file}`);
                continue;
            }

            const sql = fs.readFileSync(
                path.join(MIGRATIONS_DIR, file),
                "utf8"
            );

            console.log(`Applying: ${file}`);

            await client.query("BEGIN");

            try {
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (version) VALUES ($1)",
                    [file]
                );
                await client.query("COMMIT");
                appliedCount++;
            } catch (error) {
                await client.query("ROLLBACK");
                throw new Error(`Migration ${file} failed: ${error.message}`);
            }
        }

        console.log("--------------------------------");
        console.log(`Migrations applied: ${appliedCount}`);
        console.log(`Already up to date: ${files.length - appliedCount}`);
        console.log("--------------------------------");
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations().catch((error) => {
    console.error("Migration run failed:", error.message);
    process.exitCode = 1;
});
