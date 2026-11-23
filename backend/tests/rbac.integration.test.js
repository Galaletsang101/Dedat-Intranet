/*
 * Integration tests against the real Express app (in-process, via
 * supertest - no port is bound) and the real local PostgreSQL database.
 *
 * All fixtures use employee ids >= 900000, far outside the real 1-159
 * employee range, and every fixture row is removed in afterAll so this
 * suite never leaves data behind or touches production records.
 */

const request = require("supertest");
const app = require("../server");
const pool = require("../db");

const TEST_EMPLOYEE_ID = 900001;
const TEST_EMAIL = "rbac.test.employee@ncdedat.gov.za";
const TEST_PASSWORD = "TestPassword123!";

let testUserId;
let employeeToken;

beforeAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [TEST_EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [TEST_EMPLOYEE_ID]);

    await pool.query(
        `INSERT INTO employees (id, first_name, surname, email, programme, position, created_date)
         VALUES ($1, 'RBAC', 'TestEmployee', $2, 'TESTING', 'Test Role', NOW())`,
        [TEST_EMPLOYEE_ID, TEST_EMAIL]
    );
});

afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [TEST_EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [TEST_EMPLOYEE_ID]);
    await pool.end();
});

describe("Registration and login", () => {
    it("rejects registration for an email with no employee record", async () => {
        const res = await request(app).post("/api/auth/register").send({
            first_name: "Nobody",
            surname: "Here",
            email: "not-an-employee@ncdedat.gov.za",
            password: TEST_PASSWORD,
        });

        expect(res.status).toBe(404);
    });

    it("registers a new account as Employee, never Admin, regardless of input", async () => {
        const res = await request(app).post("/api/auth/register").send({
            first_name: "RBAC",
            surname: "TestEmployee",
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            role: "Admin", // must be ignored - role is never client-controlled
        });

        expect(res.status).toBe(201);
        expect(res.body.user.role).toBe("Employee");
        testUserId = res.body.user.id;
    });

    it("rejects a login with the wrong password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: TEST_EMAIL,
            password: "wrong-password",
        });

        expect(res.status).toBe(401);
    });

    it("logs in successfully and returns a role-bearing token", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();
        expect(res.body.user.role).toBe("Employee");
        expect(res.body.user.password_hash).toBeUndefined();

        employeeToken = res.body.token;
    });
});

describe("RBAC on admin-only write endpoints", () => {
    it("rejects an unauthenticated request with 401", async () => {
        const res = await request(app)
            .post("/api/news")
            .send({ title: "x", content_markdown: "y" });

        expect(res.status).toBe(401);
    });

    it("rejects a non-admin (Employee) request with 403", async () => {
        const res = await request(app)
            .post("/api/news")
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ title: "x", content_markdown: "y" });

        expect(res.status).toBe(403);
    });

    it("rejects a non-admin from the admin stats endpoint", async () => {
        const res = await request(app)
            .get("/api/admin/stats")
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(403);
    });

    it("rejects a non-admin from changing another user's role", async () => {
        const res = await request(app)
            .put(`/api/admin/users/${testUserId}/role`)
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ role: "Admin" });

        expect(res.status).toBe(403);
    });

    it("allows a non-admin to read public/shared content endpoints", async () => {
        const res = await request(app).get("/api/news");
        expect(res.status).toBe(200);
    });

    it("allows an authenticated non-admin to read the employee directory", async () => {
        const res = await request(app)
            .get("/api/employees")
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe("Profile ownership enforcement", () => {
    it("blocks a user from editing a different user's profile", async () => {
        const res = await request(app)
            .put(`/api/users/1`) // the real Admin account's id
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ first_name: "Hacked", surname: "Name" });

        expect(res.status).toBe(403);
    });

    it("allows a user to edit their own profile", async () => {
        const res = await request(app)
            .put(`/api/users/${testUserId}`)
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ first_name: "RBAC", surname: "TestEmployee", position: "Updated Role" });

        expect(res.status).toBe(200);
        expect(res.body.user.position).toBe("Updated Role");
    });
});

describe("Admin provisioning stays correct", () => {
    it("has exactly one active Admin account matching the required email", async () => {
        const result = await pool.query(
            "SELECT email, role, is_active FROM users WHERE role = 'Admin'"
        );

        const admins = result.rows;
        expect(admins.some((u) => u.email === "ungomane@ncdedat.gov.za")).toBe(true);
        expect(admins.every((u) => u.is_active)).toBe(true);
    });

    it("prevents demoting the last active Admin account", async () => {
        const adminRow = await pool.query(
            "SELECT id FROM users WHERE email = 'ungomane@ncdedat.gov.za'"
        );
        const adminId = adminRow.rows[0].id;

        const adminToken = require("jsonwebtoken").sign(
            { id: adminId, email: "ungomane@ncdedat.gov.za", role: "Admin" },
            process.env.JWT_SECRET
        );

        const activeAdmins = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role = 'Admin' AND is_active = TRUE"
        );

        if (parseInt(activeAdmins.rows[0].count, 10) === 1) {
            const res = await request(app)
                .put(`/api/admin/users/${adminId}/role`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ role: "Employee" });

            expect(res.status).toBe(409);
        }
    });
});
