/*
 * Unit tests for backend/middleware/auth.js.
 * No real database or HTTP server involved - `pool.query` is mocked so
 * these run fast and never touch production data.
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../db", () => ({
    query: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const pool = require("../db");
const { authenticateToken, requireRole, requireAdmin } = require("../middleware/auth");

function mockRes() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };
}

describe("authenticateToken", () => {
    it("rejects requests with no Authorization header", () => {
        const req = { headers: {} };
        const res = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects an invalid/expired token", () => {
        const req = { headers: { authorization: "Bearer not-a-real-token" } };
        const res = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("attaches decoded claims and calls next() for a valid token", () => {
        const token = jwt.sign(
            { id: 1, email: "ungomane@ncdedat.gov.za", role: "Admin" },
            process.env.JWT_SECRET
        );
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user.id).toBe(1);
        expect(req.user.role).toBe("Admin");
    });
});

describe("requireRole", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    it("blocks when there is no authenticated user on the request", async () => {
        const req = { user: null };
        const res = mockRes();
        const next = jest.fn();

        await requireAdmin(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("blocks a deactivated account even if the role would match", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ role: "Admin", is_active: false }],
        });

        const req = { user: { id: 1 } };
        const res = mockRes();
        const next = jest.fn();

        await requireAdmin(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("blocks a non-admin role from an admin-only action", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ role: "Employee", is_active: true }],
        });

        const req = { user: { id: 2 } };
        const res = mockRes();
        const next = jest.fn();

        await requireAdmin(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("re-checks the role in the database rather than trusting the JWT claim", async () => {
        // The JWT says Employee, but the live DB row says Admin - the DB
        // must win, because a promotion should take effect immediately.
        pool.query.mockResolvedValueOnce({
            rows: [{ role: "Admin", is_active: true }],
        });

        const req = { user: { id: 1, role: "Employee" } };
        const res = mockRes();
        const next = jest.fn();

        await requireAdmin(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user.role).toBe("Admin");
    });

    it("allows access when the role is in the allowed set", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ role: "Employee", is_active: true }],
        });

        const req = { user: { id: 3 } };
        const res = mockRes();
        const next = jest.fn();

        await requireRole("Employee", "Admin")(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("returns 403 when the user id no longer exists", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const req = { user: { id: 999 } };
        const res = mockRes();
        const next = jest.fn();

        await requireAdmin(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });
});
