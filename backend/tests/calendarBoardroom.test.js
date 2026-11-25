/*
 * Regression coverage for boardroom booking in POST /api/calendar-events.
 *
 * Bug found via systematic debugging: the conflict check compared ALL rows
 * with category = 'Boardroom' against the requested time window, regardless
 * of which room was meant. That made booking any one boardroom (e.g.
 * Augrabies at 10:00-11:00) block booking every other boardroom
 * (e.g. Flamingo at 10:00-11:00) on the same day - a false double-booking.
 * Root cause: the table had no column identifying which physical room a
 * booking was for. Fix: added `location`, require it for Boardroom events,
 * and scope the conflict check to the same category AND the same location.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

let token;
let expectedOrganiser;
const createdIds = [];

beforeAll(async () => {
    const userRow = await pool.query(
        "SELECT id, email, first_name, surname FROM users LIMIT 1"
    );

    token = jwt.sign(
        { id: userRow.rows[0].id, email: userRow.rows[0].email, role: "Staff" },
        process.env.JWT_SECRET
    );

    expectedOrganiser =
        `${userRow.rows[0].first_name} ${userRow.rows[0].surname}`.trim();
});

afterAll(async () => {
    if (createdIds.length > 0) {
        await pool.query("DELETE FROM calendar_events WHERE id = ANY($1)", [
            createdIds,
        ]);
    }
    await pool.end();
});

describe("POST /api/calendar-events - boardroom location", () => {
    it("rejects a Boardroom booking with no location", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "No Room Picked",
                start_time: "2026-12-01 09:00:00",
                end_time: "2026-12-01 10:00:00",
                category: "Boardroom",
            });

        expect(res.status).toBe(400);
    });

    it("rejects a Boardroom booking with a location not on the known list", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Made Up Room",
                start_time: "2026-12-01 09:00:00",
                end_time: "2026-12-01 10:00:00",
                category: "Boardroom",
                location: "Not A Real Room",
            });

        expect(res.status).toBe(400);
    });

    it("books a known boardroom successfully and stores its location", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Budget Planning",
                start_time: "2026-12-01 09:00:00",
                end_time: "2026-12-01 10:00:00",
                category: "Boardroom",
                location: "Augrabies",
            });

        expect(res.status).toBe(201);
        expect(res.body.location).toBe("Augrabies");

        createdIds.push(res.body.id);
    });

    it("blocks a second booking of the SAME room for an overlapping time", async () => {
        const first = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Strategy Session",
                start_time: "2026-12-02 09:00:00",
                end_time: "2026-12-02 10:00:00",
                category: "Boardroom",
                location: "Flamingo",
            });

        expect(first.status).toBe(201);
        createdIds.push(first.body.id);

        const second = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Overlapping Flamingo Booking",
                start_time: "2026-12-02 09:30:00",
                end_time: "2026-12-02 10:30:00",
                category: "Boardroom",
                location: "Flamingo",
            });

        expect(second.status).toBe(409);
    });

    it("allows booking a DIFFERENT room for the exact same overlapping time (the bug)", async () => {
        const first = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Kokerboom Booking",
                start_time: "2026-12-03 13:00:00",
                end_time: "2026-12-03 14:00:00",
                category: "Boardroom",
                location: "Kokerboom",
            });

        expect(first.status).toBe(201);
        createdIds.push(first.body.id);

        const second = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Namakwa Daisies Booking",
                start_time: "2026-12-03 13:00:00",
                end_time: "2026-12-03 14:00:00",
                category: "Boardroom",
                location: "Namakwa Daisies",
            });

        expect(second.status).toBe(201);
        createdIds.push(second.body.id);
    });
});

describe("POST /api/calendar-events - organiser and booking details", () => {
    it("derives organiser from the authenticated user's DB row, ignoring any client-supplied organiser", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Organiser Spoof Attempt",
                start_time: "2026-12-04 09:00:00",
                end_time: "2026-12-04 10:00:00",
                category: "Boardroom",
                location: "Tshepe",
                organiser: "Someone Else",
            });

        expect(res.status).toBe(201);
        expect(res.body.organiser).toBe(expectedOrganiser);
        expect(res.body.organiser).not.toBe("Someone Else");

        createdIds.push(res.body.id);
    });

    it("stores a valid attendees count and requirements text for a Boardroom booking", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Quarterly Review",
                start_time: "2026-12-04 11:00:00",
                end_time: "2026-12-04 12:00:00",
                category: "Boardroom",
                location: "Tshepe",
                attendees: 12,
                requirements: "Projector and whiteboard",
            });

        expect(res.status).toBe(201);
        expect(res.body.attendees).toBe(12);
        expect(res.body.requirements).toBe("Projector and whiteboard");

        createdIds.push(res.body.id);
    });

    it("leaves attendees and requirements null when omitted", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "No Extra Details",
                start_time: "2026-12-04 13:00:00",
                end_time: "2026-12-04 14:00:00",
                category: "Boardroom",
                location: "Tshepe",
            });

        expect(res.status).toBe(201);
        expect(res.body.attendees).toBeNull();
        expect(res.body.requirements).toBeNull();

        createdIds.push(res.body.id);
    });

    it("rejects an attendees value that is not a whole number", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Fractional Attendees",
                start_time: "2026-12-04 15:00:00",
                end_time: "2026-12-04 16:00:00",
                category: "Boardroom",
                location: "Tshepe",
                attendees: 2.5,
            });

        expect(res.status).toBe(400);
    });

    it("rejects an attendees value of zero or negative", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Zero Attendees",
                start_time: "2026-12-04 17:00:00",
                end_time: "2026-12-04 18:00:00",
                category: "Boardroom",
                location: "Tshepe",
                attendees: 0,
            });

        expect(res.status).toBe(400);
    });

    it("rejects an attendees value above the sane upper bound", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Too Many Attendees",
                start_time: "2026-12-04 19:00:00",
                end_time: "2026-12-04 20:00:00",
                category: "Boardroom",
                location: "Tshepe",
                attendees: 500,
            });

        expect(res.status).toBe(400);
    });

    it("does not require attendees or requirements for non-Boardroom categories", async () => {
        const res = await request(app)
            .post("/api/calendar-events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Regular Team Meeting",
                start_time: "2026-12-04 08:00:00",
                end_time: "2026-12-04 08:30:00",
                category: "Meeting",
            });

        expect(res.status).toBe(201);
        expect(res.body.organiser).toBe(expectedOrganiser);

        createdIds.push(res.body.id);
    });
});
