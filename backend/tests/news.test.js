/*
 * Regression coverage for POST/PUT /api/news.
 *
 * Found via manual QA: publishing a news article while leaving the
 * optional "excerpt", "author" or "image_url" fields blank sent `null`
 * for columns that are NOT NULL DEFAULT '' in the schema, causing a 500
 * instead of a successful create. Root cause was `field || null` instead
 * of `field || ""` for those three columns in backend/server.js.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const pool = require("../db");

let adminToken;
let createdNewsId;

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
    if (createdNewsId) {
        await pool.query("DELETE FROM news WHERE id = $1", [createdNewsId]);
    }
    await pool.end();
});

describe("POST /api/news with optional fields omitted", () => {
    it("creates successfully when excerpt, author and image_url are absent", async () => {
        const res = await request(app)
            .post("/api/news")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Regression Test Article",
                content_markdown: "Body text only, no optional fields.",
                category: "News",
            });

        expect(res.status).toBe(201);
        expect(res.body.excerpt).toBe("");
        expect(res.body.author).toBe("");
        expect(res.body.image_url).toBe("");

        createdNewsId = res.body.id;
    });

    it("creates successfully when excerpt/author/image_url are explicit empty strings", async () => {
        const res = await request(app)
            .post("/api/news")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Regression Test Article 2",
                content_markdown: "Body text.",
                category: "News",
                excerpt: "",
                author: "",
                image_url: "",
            });

        expect(res.status).toBe(201);

        await pool.query("DELETE FROM news WHERE id = $1", [res.body.id]);
    });
});
