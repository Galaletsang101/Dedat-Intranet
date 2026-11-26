/*
 * Coverage for DELETE /api/calendar-events/:id - giving Admins the power
 * to cancel any calendar event (not just Boardroom bookings).
 *
 * Like every other admin-only write in this app, authorization is
 * enforced by requireAdmin, which re-reads the caller's role from
 * Postgres on every request rather than trusting the JWT's role claim
 * (see backend/middleware/auth.js) - a non-admin fixture user is used
 * here precisely to prove that server-side check, not just a client
 * assumption.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

const FIXTURE_EMPLOYEE_ID = 900002;
const FIXTURE_EMAIL = "calendar.cancel.test.employee@ncdedat.gov.za";

let adminToken;
let employeeToken;
const createdEventIds = [];

beforeAll(async () => {
    const adminRow = await pool.query(
        "SELECT id FROM users WHERE email = 'ungomane@ncdedat.gov.za'"
    );

    adminToken = jwt.sign(
        { id: adminRow.rows[0].id, email: "ungomane@ncdedat.gov.za", role: "Admin" },
        process.env.JWT_SECRET
    );

    await pool.query("DELETE FROM users WHERE email = $1", [FIXTURE_EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [FIXTURE_EMPLOYEE_ID]);

    await pool.query(
        `INSERT INTO employees (id, first_name, surname, email, programme, position, created_date)
         VALUES ($1, 'Cancel', 'TestEmployee', $2, 'TESTING', 'Test Role', NOW())`,
        [FIXTURE_EMPLOYEE_ID, FIXTURE_EMAIL]
    );

    const registerRes = await request(app).post("/api/auth/register").send({
        first_name: "Cancel",
        surname: "TestEmployee",
        email: FIXTURE_EMAIL,
        password: "TestPassword123!",
    });

    employeeToken = jwt.sign(
        { id: registerRes.body.user.id, email: FIXTURE_EMAIL, role: "Employee" },
        process.env.JWT_SECRET
    );
});

afterAll(async () => {
    if (createdEventIds.length > 0) {
        await pool.query("DELETE FROM calendar_events WHERE id = ANY($1)", [
            createdEventIds,
        ]);
    }
    await pool.query("DELETE FROM users WHERE email = $1", [FIXTURE_EMAIL]);
    await pool.query("DELETE FROM employees WHERE id = $1", [FIXTURE_EMPLOYEE_ID]);
    await pool.end();
});

async function createTestEvent(title) {
    const res = await request(app)
        .post("/api/calendar-events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            title,
            start_time: "2026-12-05 09:00:00",
            end_time: "2026-12-05 10:00:00",
            category: "Meeting",
        });

    createdEventIds.push(res.body.id);
    return res.body.id;
}

describe("DELETE /api/calendar-events/:id", () => {
    it("rejects cancellation with no authentication token", async () => {
        const eventId = await createTestEvent("No Auth Cancel Attempt");

        const res = await request(app).delete(`/api/calendar-events/${eventId}`);

        expect(res.status).toBe(401);
    });

    it("rejects cancellation from a non-Admin user and leaves the event intact", async () => {
        const eventId = await createTestEvent("Non-Admin Cancel Attempt");

        const res = await request(app)
            .delete(`/api/calendar-events/${eventId}`)
            .set("Authorization", `Bearer ${employeeToken}`);

        expect(res.status).toBe(403);

        const stillThere = await pool.query(
            "SELECT id FROM calendar_events WHERE id = $1",
            [eventId]
        );
        expect(stillThere.rows.length).toBe(1);
    });

    it("allows an Admin to cancel any category of event", async () => {
        const eventId = await createTestEvent("Admin Cancel Target");

        const res = await request(app)
            .delete(`/api/calendar-events/${eventId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);

        const gone = await pool.query(
            "SELECT id FROM calendar_events WHERE id = $1",
            [eventId]
        );
        expect(gone.rows.length).toBe(0);

        createdEventIds.splice(createdEventIds.indexOf(eventId), 1);
    });

    it("allows an Admin to cancel a Boardroom booking, freeing the room", async () => {
        const bookingRes = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Boardroom Booking To Cancel",
                start_time: "2026-12-06 09:00:00",
                end_time: "2026-12-06 10:00:00",
                category: "Boardroom",
                location: "Augrabies",
            });

        const eventId = bookingRes.body.id;
        createdEventIds.push(eventId);

        const cancelRes = await request(app)
            .delete(`/api/calendar-events/${eventId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(cancelRes.status).toBe(200);

        // The room should now be free for the exact same slot.
        const rebookRes = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Rebooking After Cancellation",
                start_time: "2026-12-06 09:00:00",
                end_time: "2026-12-06 10:00:00",
                category: "Boardroom",
                location: "Augrabies",
            });

        expect(rebookRes.status).toBe(201);
        createdEventIds.push(rebookRes.body.id);
    });

    it("returns 404 when cancelling an event that does not exist", async () => {
        const res = await request(app)
            .delete("/api/calendar-events/999999999")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
    });
});
