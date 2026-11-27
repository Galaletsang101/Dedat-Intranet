/*
 * Sub-programmes are a new normalized table nested under `departments`
 * ("programmes" in the UI). Only Admins may create/edit/deactivate them;
 * any authenticated user may list them for a given department. Tests use
 * their own disposable department (not one of the 6 real seeded ones) so
 * listing/count assertions aren't coupled to the migration's seed data.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

const EMPLOYEE_ID = 900010;
const EMAIL = "subprogrammes.employee.test@ncdedat.gov.za";
const DEPARTMENT_NAME = "Test Sub-Programmes Department";
const OTHER_DEPARTMENT_NAME = "Test Sub-Programmes Department (Other)";

let adminToken;
let employeeToken;
let departmentId;
let otherDepartmentId;
const createdSubProgrammeIds = [];

beforeAll(async () => {
    const adminRow = await pool.query(
        "SELECT id FROM users WHERE email = 'ungomane@ncdedat.gov.za'"
    );
    adminToken = jwt.sign(
        { id: adminRow.rows[0].id, email: "ungomane@ncdedat.gov.za", role: "Admin" },
        process.env.JWT_SECRET
    );

    await pool.query("DELETE FROM users WHERE email = $1", [EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [EMPLOYEE_ID]);
    await pool.query("DELETE FROM sub_programmes WHERE department_id IN (SELECT id FROM departments WHERE name IN ($1, $2))", [
        DEPARTMENT_NAME,
        OTHER_DEPARTMENT_NAME,
    ]);
    await pool.query("DELETE FROM departments WHERE name IN ($1, $2)", [
        DEPARTMENT_NAME,
        OTHER_DEPARTMENT_NAME,
    ]);

    await pool.query(
        `INSERT INTO employees (id, first_name, surname, email, programme, position, created_date)
         VALUES ($1, 'SubProg', 'TestEmployee', $2, 'TESTING', 'Test Role', NOW())`,
        [EMPLOYEE_ID, EMAIL]
    );

    const employeeRegister = await request(app).post("/api/auth/register").send({
        first_name: "SubProg",
        surname: "TestEmployee",
        email: EMAIL,
        password: "TestPassword123!",
    });
    employeeToken = jwt.sign(
        { id: employeeRegister.body.user.id, email: EMAIL, role: "Employee" },
        process.env.JWT_SECRET
    );

    const deptRes = await request(app)
        .post("/api/departments")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: DEPARTMENT_NAME, description: "Disposable test department" });
    departmentId = deptRes.body.id;

    const otherDeptRes = await request(app)
        .post("/api/departments")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: OTHER_DEPARTMENT_NAME, description: "Disposable test department" });
    otherDepartmentId = otherDeptRes.body.id;
});

afterAll(async () => {
    if (createdSubProgrammeIds.length > 0) {
        await pool.query("DELETE FROM sub_programmes WHERE id = ANY($1)", [
            createdSubProgrammeIds,
        ]);
    }
    await pool.query("DELETE FROM departments WHERE name IN ($1, $2)", [
        DEPARTMENT_NAME,
        OTHER_DEPARTMENT_NAME,
    ]);
    await pool.query("DELETE FROM users WHERE email = $1", [EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [EMPLOYEE_ID]);
    await pool.end();
});

describe("POST /api/departments/:id/sub-programmes", () => {
    it("rejects a non-admin", async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ name: "Should Not Be Created" });

        expect(res.status).toBe(403);
    });

    it("creates a sub-programme for an admin", async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Policy & Planning", description: "Handles policy work." });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Policy & Planning");
        expect(String(res.body.department_id)).toBe(String(departmentId));
        expect(res.body.status).toBe("Active");

        createdSubProgrammeIds.push(res.body.id);
    });

    it("rejects a blank name", async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "   " });

        expect(res.status).toBe(400);
    });

    it("returns 404 for an unknown department", async () => {
        const res = await request(app)
            .post("/api/departments/999999999/sub-programmes")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Orphan Sub-Programme" });

        expect(res.status).toBe(404);
    });

    it("rejects a duplicate name (case-insensitive) within the same department", async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "policy & planning" });

        expect(res.status).toBe(409);
    });

    it("allows the same name in a different department", async () => {
        const res = await request(app)
            .post(`/api/departments/${otherDepartmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Policy & Planning" });

        expect(res.status).toBe(201);
        createdSubProgrammeIds.push(res.body.id);
    });
});

describe("GET /api/departments/:id/sub-programmes", () => {
    it("returns only the requested department's sub-programmes, ordered by name", async () => {
        await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Admin & Compliance" })
            .then((res) => createdSubProgrammeIds.push(res.body.id));

        const res = await request(app)
            .get(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(200);
        const names = res.body.map((s) => s.name);
        expect(names).toEqual(["Admin & Compliance", "Policy & Planning"]);
        expect(names).not.toContain("Policy & Planning".toUpperCase());
    });

    it("returns 404 for an unknown department", async () => {
        const res = await request(app)
            .get("/api/departments/999999999/sub-programmes")
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(404);
    });
});

describe("PUT /api/sub-programmes/:id", () => {
    let subProgrammeId;

    beforeAll(async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "To Be Edited" });
        subProgrammeId = res.body.id;
        createdSubProgrammeIds.push(subProgrammeId);
    });

    it("rejects a non-admin", async () => {
        const res = await request(app)
            .put(`/api/sub-programmes/${subProgrammeId}`)
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({ name: "Hijacked" });

        expect(res.status).toBe(403);
    });

    it("updates fields for an admin", async () => {
        const res = await request(app)
            .put(`/api/sub-programmes/${subProgrammeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Edited Name", description: "New description", status: "Active" });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Edited Name");
        expect(res.body.description).toBe("New description");
    });

    it("returns 404 for an unknown sub-programme", async () => {
        const res = await request(app)
            .put("/api/sub-programmes/999999999")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Nothing" });

        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/sub-programmes/:id", () => {
    let subProgrammeId;

    beforeAll(async () => {
        const res = await request(app)
            .post(`/api/departments/${departmentId}/sub-programmes`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "To Be Deactivated" });
        subProgrammeId = res.body.id;
        createdSubProgrammeIds.push(subProgrammeId);
    });

    it("rejects a non-admin", async () => {
        const res = await request(app)
            .delete(`/api/sub-programmes/${subProgrammeId}`)
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(403);
    });

    it("soft-deletes (sets status Inactive) for an admin", async () => {
        const res = await request(app)
            .delete(`/api/sub-programmes/${subProgrammeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);

        const row = await pool.query("SELECT status FROM sub_programmes WHERE id = $1", [
            subProgrammeId,
        ]);
        expect(row.rows[0].status).toBe("Inactive");
    });

    it("returns 404 for an unknown sub-programme", async () => {
        const res = await request(app)
            .delete("/api/sub-programmes/999999999")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
    });
});

describe("GET /api/departments - sub_programme_count", () => {
    it("reflects only Active sub-programmes for the department", async () => {
        const res = await request(app)
            .get("/api/departments")
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(200);
        const dept = res.body.find((d) => String(d.id) === String(departmentId));
        // Policy & Planning + Admin & Compliance + To Be Edited (now
        // "Edited Name") are Active; "To Be Deactivated" was just set
        // Inactive above, so it must not count.
        expect(parseInt(dept.sub_programme_count, 10)).toBe(3);
    });
});
