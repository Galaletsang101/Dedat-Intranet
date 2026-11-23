/*
 * Covers the Draft/Published workflow added to news and wellness_videos,
 * and the single-article/single-video retrieval endpoints that back the
 * full-article reading page and the Wellness video player.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

let adminToken;
let draftNewsId;
let draftWellnessId;

beforeAll(async () => {
    const adminRow = await pool.query(
        "SELECT id FROM users WHERE email = 'ungomane@ncdedat.gov.za'"
    );

    adminToken = jwt.sign(
        { id: adminRow.rows[0].id, email: "ungomane@ncdedat.gov.za", role: "Admin" },
        process.env.JWT_SECRET
    );
});

afterAll(async () => {
    if (draftNewsId) await pool.query("DELETE FROM news WHERE id = $1", [draftNewsId]);
    if (draftWellnessId)
        await pool.query("DELETE FROM wellness_videos WHERE id = $1", [draftWellnessId]);
    await pool.end();
});

describe("News draft visibility", () => {
    it("creates a Draft article that does not appear in the public list", async () => {
        const createRes = await request(app)
            .post("/api/news")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Draft Regression Test",
                content_markdown: "Not ready yet.",
                category: "News",
                status: "Draft",
            });

        expect(createRes.status).toBe(201);
        expect(createRes.body.status).toBe("Draft");
        draftNewsId = createRes.body.id;

        const listRes = await request(app).get("/api/news");
        expect(listRes.body.some((a) => a.id === draftNewsId)).toBe(false);
    });

    it("404s a Draft article for an unauthenticated request", async () => {
        const res = await request(app).get(`/api/news/${draftNewsId}`);
        expect(res.status).toBe(404);
    });

    it("404s a Draft article for a non-admin request", async () => {
        // A forged non-admin token for a nonexistent user id also 404s,
        // but we want to prove a REAL employee can't see it either -
        // reuse the admin's id with a stale "Employee" claim: requireRole-style
        // checks re-verify against the DB, but this route uses isAdminRequest()
        // which also re-checks the DB, so what matters is the DB's actual role.
        // Simplest honest check: an entirely unauthenticated request (above)
        // plus a token for a non-existent user id, which must also fail closed.
        const bogusToken = jwt.sign({ id: 999999 }, process.env.JWT_SECRET);
        const res = await request(app)
            .get(`/api/news/${draftNewsId}`)
            .set("Authorization", `Bearer ${bogusToken}`);
        expect(res.status).toBe(404);
    });

    it("200s a Draft article for the Admin", async () => {
        const res = await request(app)
            .get(`/api/news/${draftNewsId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Draft Regression Test");
    });

    it("publishing (status: Published) makes it appear in the public list", async () => {
        await request(app)
            .put(`/api/news/${draftNewsId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Draft Regression Test",
                content_markdown: "Now ready.",
                category: "News",
                status: "Published",
            });

        const listRes = await request(app).get("/api/news");
        expect(listRes.body.some((a) => a.id === draftNewsId)).toBe(true);
    });

    it("404s a nonexistent article id", async () => {
        const res = await request(app).get("/api/news/99999999");
        expect(res.status).toBe(404);
    });
});

describe("Wellness draft visibility and required video source", () => {
    it("rejects creating a wellness video with no video_url", async () => {
        const res = await request(app)
            .post("/api/wellness")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ title: "No video" });

        expect(res.status).toBe(400);
    });

    it("creates a Draft video that does not appear in the public list", async () => {
        const createRes = await request(app)
            .post("/api/wellness")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Draft Wellness Regression Test",
                video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                status: "Draft",
            });

        expect(createRes.status).toBe(201);
        draftWellnessId = createRes.body.id;

        const listRes = await request(app).get("/api/wellness");
        expect(listRes.body.some((v) => v.id === draftWellnessId)).toBe(false);
    });

    it("404s a Draft video for an unauthenticated request, 200s for Admin", async () => {
        const anon = await request(app).get(`/api/wellness/${draftWellnessId}`);
        expect(anon.status).toBe(404);

        const admin = await request(app)
            .get(`/api/wellness/${draftWellnessId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(admin.status).toBe(200);
    });
});

describe("Wellness video upload", () => {
    it("rejects an upload with no file", async () => {
        const res = await request(app)
            .post("/api/wellness/upload")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
    });

    it("rejects an upload from a non-admin", async () => {
        const res = await request(app).post("/api/wellness/upload");
        expect(res.status).toBe(401);
    });

    it("accepts a small video file and returns a playable URL", async () => {
        const res = await request(app)
            .post("/api/wellness/upload")
            .set("Authorization", `Bearer ${adminToken}`)
            .attach("video", Buffer.from("fake mp4 bytes"), {
                filename: "clip.mp4",
                contentType: "video/mp4",
            });

        expect(res.status).toBe(201);
        expect(res.body.url).toMatch(/^http:\/\/.+\/uploads\/videos\/.+\.mp4$/);

        // Clean up the file this test wrote to disk.
        const fs = require("fs");
        const path = require("path");
        const filename = res.body.url.split("/uploads/videos/")[1];
        const filePath = path.join(__dirname, "..", "uploads", "videos", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    it("rejects a non-video file", async () => {
        const res = await request(app)
            .post("/api/wellness/upload")
            .set("Authorization", `Bearer ${adminToken}`)
            .attach("video", Buffer.from("not a video"), {
                filename: "doc.txt",
                contentType: "text/plain",
            });

        expect(res.status).toBe(400);
    });
});
