/*
 * Lets the person who created a Boardroom booking edit or cancel it
 * themselves, in addition to Admins. Ownership is tracked via
 * `created_by`, set server-side from the authenticated user's id at
 * creation time - never from a client-supplied value, and never inferred
 * from the `organiser` display string (which is just a name, not a safe
 * identity check).
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

const OWNER_EMPLOYEE_ID = 900003;
const OWNER_EMAIL = "calendar.owner.test@ncdedat.gov.za";
const OTHER_EMPLOYEE_ID = 900004;
const OTHER_EMAIL = "calendar.other.test@ncdedat.gov.za";

let adminToken;
let ownerToken;
let ownerId;
let otherToken;
const createdEventIds = [];

beforeAll(async () => {
    const adminRow = await pool.query(
        "SELECT id FROM users WHERE email = 'ungomane@ncdedat.gov.za'"
    );
    adminToken = jwt.sign(
        { id: adminRow.rows[0].id, email: "ungomane@ncdedat.gov.za", role: "Admin" },
        process.env.JWT_SECRET
    );

    await pool.query("DELETE FROM users WHERE email IN ($1, $2)", [
        OWNER_EMAIL,
        OTHER_EMAIL,
    ]);
    await pool.query("DELETE FROM employees WHERE id IN ($1, $2)", [
        OWNER_EMPLOYEE_ID,
        OTHER_EMPLOYEE_ID,
    ]);

    await pool.query(
        `INSERT INTO employees (id, first_name, surname, email, programme, position, created_date)
         VALUES ($1, 'Owner', 'TestEmployee', $2, 'TESTING', 'Test Role', NOW())`,
        [OWNER_EMPLOYEE_ID, OWNER_EMAIL]
    );
    await pool.query(
        `INSERT INTO employees (id, first_name, surname, email, programme, position, created_date)
         VALUES ($1, 'Other', 'TestEmployee', $2, 'TESTING', 'Test Role', NOW())`,
        [OTHER_EMPLOYEE_ID, OTHER_EMAIL]
    );

    const ownerRegister = await request(app).post("/api/auth/register").send({
        first_name: "Owner",
        surname: "TestEmployee",
        email: OWNER_EMAIL,
        password: "TestPassword123!",
    });
    ownerId = ownerRegister.body.user.id;
    ownerToken = jwt.sign(
        { id: ownerId, email: OWNER_EMAIL, role: "Employee" },
        process.env.JWT_SECRET
    );

    const otherRegister = await request(app).post("/api/auth/register").send({
        first_name: "Other",
        surname: "TestEmployee",
        email: OTHER_EMAIL,
        password: "TestPassword123!",
    });
    otherToken = jwt.sign(
        { id: otherRegister.body.user.id, email: OTHER_EMAIL, role: "Employee" },
        process.env.JWT_SECRET
    );
});

afterAll(async () => {
    if (createdEventIds.length > 0) {
        await pool.query("DELETE FROM calendar_events WHERE id = ANY($1)", [
            createdEventIds,
        ]);
    }
    await pool.query("DELETE FROM users WHERE email IN ($1, $2)", [
        OWNER_EMAIL,
        OTHER_EMAIL,
    ]);
    await pool.query("DELETE FROM employees WHERE id IN ($1, $2)", [
        OWNER_EMPLOYEE_ID,
        OTHER_EMPLOYEE_ID,
    ]);
    await pool.end();
});

// Each call defaults to its OWN day, so independent tests never collide
// with the real (and correct) same-room same-time conflict check that
// already exists - only the explicit conflict-check tests below pass a
// shared slot on purpose.
let nextTestDay = 10;

async function bookAsOwner(overrides = {}) {
    const day = nextTestDay++;
    const datePrefix = `2026-12-${String(day).padStart(2, "0")}`;

    const res = await request(app)
        .post("/api/calendar-events")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
            title: "Owner's Boardroom Booking",
            start_time: `${datePrefix} 09:00:00`,
            end_time: `${datePrefix} 10:00:00`,
            category: "Boardroom",
            location: "Augrabies",
            ...overrides,
        });

    createdEventIds.push(res.body.id);
    return { ...res.body, datePrefix };
}

describe("POST /api/calendar-events - records the creator", () => {
    it("stores created_by as the authenticated user's own id", async () => {
        const booking = await bookAsOwner();

        const row = await pool.query(
            "SELECT created_by FROM calendar_events WHERE id = $1",
            [booking.id]
        );

        expect(String(row.rows[0].created_by)).toBe(String(ownerId));
    });
});

describe("PUT /api/calendar-events/:id", () => {
    it("lets the creator edit their own Boardroom booking", async () => {
        const booking = await bookAsOwner({ title: "Original Title" });

        const res = await request(app)
            .put(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Updated Title",
                start_time: `${booking.datePrefix} 09:00:00`,
                end_time: `${booking.datePrefix} 10:00:00`,
                location: "Augrabies",
                attendees: 5,
            });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Updated Title");
        expect(res.body.attendees).toBe(5);
    });

    it("rejects an edit from a user who neither owns nor administers the booking", async () => {
        const booking = await bookAsOwner();

        const res = await request(app)
            .put(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${otherToken}`)
            .send({
                title: "Hijacked Title",
                start_time: `${booking.datePrefix} 09:00:00`,
                end_time: `${booking.datePrefix} 10:00:00`,
                location: "Augrabies",
            });

        expect(res.status).toBe(403);

        const unchanged = await pool.query(
            "SELECT title FROM calendar_events WHERE id = $1",
            [booking.id]
        );
        expect(unchanged.rows[0].title).not.toBe("Hijacked Title");
    });

    it("lets an Admin edit a Boardroom booking they do not own", async () => {
        const booking = await bookAsOwner({ title: "Needs Admin Fix" });

        const res = await request(app)
            .put(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Fixed By Admin",
                start_time: `${booking.datePrefix} 09:00:00`,
                end_time: `${booking.datePrefix} 10:00:00`,
                location: "Augrabies",
            });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Fixed By Admin");
    });

    it("allows saving unchanged time/room without tripping the conflict check against itself", async () => {
        const booking = await bookAsOwner();

        const res = await request(app)
            .put(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Owner's Boardroom Booking",
                description: "Added a description",
                start_time: `${booking.datePrefix} 09:00:00`,
                end_time: `${booking.datePrefix} 10:00:00`,
                location: "Augrabies",
            });

        expect(res.status).toBe(200);
    });

    it("rejects an edit that would conflict with a different booking in the same room", async () => {
        const booking = await bookAsOwner({
            title: "Movable Booking",
            start_time: "2027-01-05 09:00:00",
            end_time: "2027-01-05 10:00:00",
            location: "Kokerboom",
        });

        const blockerRes = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Existing Kokerboom Booking",
                start_time: "2027-01-05 13:00:00",
                end_time: "2027-01-05 14:00:00",
                category: "Boardroom",
                location: "Kokerboom",
            });
        createdEventIds.push(blockerRes.body.id);

        const res = await request(app)
            .put(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Movable Booking",
                start_time: "2027-01-05 13:30:00",
                end_time: "2027-01-05 14:30:00",
                location: "Kokerboom",
            });

        expect(res.status).toBe(409);
    });

    it("returns 404 when editing an event that does not exist", async () => {
        const res = await request(app)
            .put("/api/calendar-events/999999999")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Nothing",
                start_time: "2026-12-10 09:00:00",
                end_time: "2026-12-10 10:00:00",
                location: "Augrabies",
            });

        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/calendar-events/:id - owner self-service", () => {
    it("lets the creator cancel their own Boardroom booking without being an Admin", async () => {
        const booking = await bookAsOwner();

        const res = await request(app)
            .delete(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(res.status).toBe(200);

        const gone = await pool.query(
            "SELECT id FROM calendar_events WHERE id = $1",
            [booking.id]
        );
        expect(gone.rows.length).toBe(0);

        createdEventIds.splice(createdEventIds.indexOf(booking.id), 1);
    });

    it("still rejects cancellation from a user who neither owns nor administers the booking", async () => {
        const booking = await bookAsOwner();

        const res = await request(app)
            .delete(`/api/calendar-events/${booking.id}`)
            .set("Authorization", `Bearer ${otherToken}`);

        expect(res.status).toBe(403);

        const stillThere = await pool.query(
            "SELECT id FROM calendar_events WHERE id = $1",
            [booking.id]
        );
        expect(stillThere.rows.length).toBe(1);
    });
});
