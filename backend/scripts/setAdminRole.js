/*
 * =========================================================
 * ADMIN ACCOUNT PROVISIONING
 * =========================================================
 *
 * Idempotently promotes a single, named employee email to the Admin role.
 * Safe to re-run: it never creates a password, never touches unrelated
 * profile fields, and never downgrades an account it didn't just create.
 *
 * - If a `users` row already exists for the email, its role is set to
 *   'Admin' and the account is (re)activated. No other field is touched.
 * - If no `users` row exists yet, but an `employees` record does, an
 *   account is provisioned WITHOUT a usable password: a random,
 *   unguessable placeholder hash is stored, `must_reset_password` is set,
 *   and a one-time password-reset token is generated so the person must
 *   set their own password through the real reset-password flow before
 *   they can log in. The token is never printed in full to logs that
 *   might be shared; it is only returned/emailed.
 *
 * Usage: node scripts/setAdminRole.js <email>
 *        npm run provision:admin -- <email>
 * =========================================================
 */

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const ADMIN_ROLE = "Admin";
const RESET_TOKEN_TTL_HOURS = 48;

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

async function provisionAdmin(email) {
    if (!email) {
        throw new Error("Usage: node scripts/setAdminRole.js <email>");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
        `SELECT id, email, role, is_active FROM users WHERE LOWER(email) = LOWER($1)`,
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        const user = existingUser.rows[0];

        if (user.role === ADMIN_ROLE && user.is_active) {
            console.log(
                `No change needed: ${user.email} already has an active Admin account.`
            );
            return { status: "unchanged", user };
        }

        const updateResult = await pool.query(
            `UPDATE users
             SET role = $1, is_active = TRUE, updated_at = NOW()
             WHERE id = $2
             RETURNING id, first_name, surname, email, role, is_active`,
            [ADMIN_ROLE, user.id]
        );

        console.log(
            `Promoted existing account ${updateResult.rows[0].email} to Admin.`
        );
        return { status: "promoted", user: updateResult.rows[0] };
    }

    // No users row yet - look up the employee record to provision from.
    const employeeResult = await pool.query(
        `SELECT id, first_name, surname, email, programme, subprogramme, position
         FROM employees
         WHERE LOWER(email) = LOWER($1)`,
        [normalizedEmail]
    );

    if (employeeResult.rows.length === 0) {
        throw new Error(
            `No employee record found for ${normalizedEmail}. This tool only provisions accounts for existing employees.`
        );
    }

    const employee = employeeResult.rows[0];

    // Unusable, never-communicated placeholder password. The account can
    // only become usable via the reset-password token issued below.
    const placeholderPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(placeholderPassword, 10);

    const insertResult = await pool.query(
        `INSERT INTO users
            (employee_id, first_name, surname, email, programme, subprogramme, position,
             password_hash, role, is_active, must_reset_password, created_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE, NOW())
         RETURNING id, first_name, surname, email, role, is_active`,
        [
            employee.id,
            employee.first_name,
            employee.surname,
            employee.email,
            employee.programme,
            employee.subprogramme || null,
            employee.position || null,
            passwordHash,
            ADMIN_ROLE,
        ]
    );

    const newUser = insertResult.rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(
        Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000
    );

    await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, purpose, expires_at)
         VALUES ($1, $2, 'invite', $3)`,
        [newUser.id, tokenHash, expiresAt]
    );

    console.log(`Created new Admin account for ${newUser.email}.`);
    console.log(
        "A one-time password-set link was generated (valid " +
            `${RESET_TOKEN_TTL_HOURS}h). Deliver it to the user out-of-band:`
    );
    console.log(`  #/reset-password?token=${token}`);
    console.log(
        "This token is only shown once here - it is not recoverable from the database."
    );

    return { status: "created", user: newUser, resetToken: token };
}

if (require.main === module) {
    const email = process.argv[2];

    provisionAdmin(email)
        .then(async (result) => {
            console.log(JSON.stringify({ status: result.status, email: result.user.email }));
            await pool.end();
        })
        .catch(async (error) => {
            console.error("Admin provisioning failed:", error.message);
            await pool.end();
            process.exitCode = 1;
        });
}

module.exports = { provisionAdmin };
