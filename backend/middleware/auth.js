/*
 * =========================================================
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * =========================================================
 *
 * This is the SINGLE place role/permission checks happen on the backend.
 * Every route that creates, updates or deletes data - and every admin-only
 * read - must go through authenticateToken and, where appropriate,
 * requireRole(...).
 *
 * Design notes:
 * - authenticateToken verifies the JWT signature/expiry and attaches the
 *   decoded claims to req.user. It does NOT trust req.user.role for
 *   authorization decisions, because a role change made by an Admin should
 *   take effect immediately, not only after the affected user's 8h token
 *   expires and they log in again.
 * - requireRole re-reads the user's current role and is_active flag from
 *   PostgreSQL on every call, so a demotion/deactivation blocks the very
 *   next request instead of waiting for token expiry.
 * =========================================================
 */

const jwt = require("jsonwebtoken");
const pool = require("../db");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access denied. No authentication token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: "Invalid or expired authentication token.",
        });
    }
}

function requireRole(...allowedRoles) {
    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                error: "Access denied. No authentication token provided.",
            });
        }

        try {
            const result = await pool.query(
                `SELECT role, is_active FROM users WHERE id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ error: "Account not found." });
            }

            const { role, is_active } = result.rows[0];

            if (!is_active) {
                return res.status(403).json({
                    error: "This account has been deactivated.",
                });
            }

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    error: "You do not have permission to perform this action.",
                });
            }

            req.user.role = role;
            next();
        } catch (error) {
            console.error("Authorization check failed:", error);
            res.status(500).json({ error: "Authorization check failed." });
        }
    };
}

const requireAdmin = requireRole("Admin");

module.exports = { authenticateToken, requireRole, requireAdmin };
