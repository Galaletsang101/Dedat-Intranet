const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pool = require("./db");
require("dotenv").config();

const { authenticateToken, requireAdmin } = require("./middleware/auth");

const app = express();
const PORT = 5000;

const VALID_ROLES = ["Employee", "Admin"];
const RESET_TOKEN_TTL_HOURS = 2;
const INVITE_TOKEN_TTL_HOURS = 48;

// ============================================================
// PASSWORD RESET EMAIL CONFIGURATION
// ============================================================

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const emailConfigured = Boolean(
    process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
);

async function sendAccountEmail({ to, subject, text }) {
    if (!emailConfigured) {
        console.warn(
            `EMAIL_USER/EMAIL_PASSWORD not configured - skipping email to ${to}. ` +
                "The link below was generated but was not delivered:"
        );
        console.warn(text);
        return false;
    }

    try {
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        return true;
    } catch (error) {
        console.error("Failed to send account email:", error.message);
        return false;
    }
}

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "DEDAT Intranet Backend is running",
    });
});

// ============================================================
// NEWS
// ============================================================

app.get("/api/news", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM news ORDER BY created_date DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

app.post("/api/news", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content_markdown,
            category,
            author,
            publication_date,
            image_url,
            is_featured,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "News title is required" });
        }

        if (!content_markdown || !content_markdown.trim()) {
            return res
                .status(400)
                .json({ error: "News Markdown content is required" });
        }

        const result = await pool.query(
            `INSERT INTO news (
                title, excerpt, content_markdown, category, author,
                publication_date, image_url, is_featured, created_date, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *`,
            [
                title.trim(),
                excerpt || "",
                content_markdown.trim(),
                category || "News",
                author || "",
                publication_date || null,
                image_url || "",
                is_featured ?? false,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ error: "Failed to create news" });
    }
});

app.put("/api/news/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            excerpt,
            content_markdown,
            category,
            author,
            publication_date,
            image_url,
            is_featured,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "News title is required" });
        }

        const result = await pool.query(
            `UPDATE news
             SET title = $1, excerpt = $2, content_markdown = $3, category = $4,
                 author = $5, publication_date = $6, image_url = $7,
                 is_featured = $8, updated_at = NOW()
             WHERE id = $9
             RETURNING *`,
            [
                title.trim(),
                excerpt || "",
                content_markdown || "",
                category || "News",
                author || "",
                publication_date || null,
                image_url || "",
                is_featured ?? false,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "News article not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ error: "Failed to update news" });
    }
});

app.delete(
    "/api/news/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM news WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "News article not found" });
            }

            res.json({
                message: "News article deleted successfully",
                news: result.rows[0],
            });
        } catch (error) {
            console.error("Error deleting news:", error);
            res.status(500).json({ error: "Failed to delete news" });
        }
    }
);

// ============================================================
// WELLNESS VIDEOS
// ============================================================

app.get("/api/wellness", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, category, duration, thumbnail,
                    video_url, featured, created_date
             FROM wellness_videos
             ORDER BY created_date DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Wellness API error:", error);
        res.status(500).json({ error: "Failed to fetch wellness videos" });
    }
});

app.post(
    "/api/wellness",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                description,
                category,
                duration,
                thumbnail,
                video_url,
                featured,
            } = req.body;

            if (!title || !title.trim()) {
                return res
                    .status(400)
                    .json({ error: "Wellness video title is required" });
            }

            const result = await pool.query(
                `INSERT INTO wellness_videos
                    (title, description, category, duration, thumbnail, video_url, featured)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, title, description, category, duration, thumbnail,
                           video_url, featured, created_date`,
                [
                    title.trim(),
                    description || "",
                    category || "Mental Health",
                    duration || "",
                    thumbnail || "",
                    video_url || "",
                    featured ?? false,
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Create wellness video API error:", error);
            res.status(500).json({ error: "Failed to create wellness video" });
        }
    }
);

// ============================================================
// CALENDAR EVENTS
// Any authenticated staff member can book/view - not an Admin-only module.
// ============================================================

app.get("/api/calendar-events", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM calendar_events ORDER BY start_time ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ error: "Failed to fetch calendar events" });
    }
});

app.post("/api/calendar-events", authenticateToken, async (req, res) => {
    try {
        const { title, description, start_time, end_time, category, quarter } =
            req.body;

        if (!title || !start_time || !end_time) {
            return res.status(400).json({
                error: "Title, start time and end time are required",
            });
        }

        if (new Date(end_time) <= new Date(start_time)) {
            return res
                .status(400)
                .json({ error: "End time must be after start time" });
        }

        const eventCategory = category || "Meeting";

        if (eventCategory === "Boardroom") {
            const conflict = await pool.query(
                `SELECT * FROM calendar_events
                 WHERE category = 'Boardroom'
                 AND start_time < $2
                 AND end_time > $1`,
                [start_time, end_time]
            );

            if (conflict.rows.length > 0) {
                return res.status(409).json({
                    error: "The boardroom is already booked for this time.",
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO calendar_events
                (title, description, start_time, end_time, category, quarter)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                title,
                description || null,
                start_time,
                end_time,
                eventCategory,
                quarter || null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error saving calendar event:", error);
        res.status(500).json({ error: "Failed to save calendar event" });
    }
});

// ============================================================
// DOCUMENTS (Knowledge Centre) - Admin-managed content
// ============================================================

app.get("/api/documents", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM documents ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

app.get("/api/documents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM documents WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ error: "Failed to fetch document" });
    }
});

app.post(
    "/api/documents",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                description,
                category,
                keywords,
                knowledge_owner,
                publication_date,
                review_date,
                version_number,
                status,
                file_url,
            } = req.body;

            if (!title || !title.trim()) {
                return res
                    .status(400)
                    .json({ error: "Document title is required" });
            }

            const result = await pool.query(
                `INSERT INTO documents (
                    title, description, category, keywords, knowledge_owner,
                    publication_date, review_date, version_number, status, file_url
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
                [
                    title.trim(),
                    description || null,
                    category || "DOCUMENT",
                    keywords || "",
                    knowledge_owner || null,
                    publication_date || null,
                    review_date || null,
                    version_number || "v1.0",
                    status || "Published",
                    file_url || null,
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error creating document:", error);
            res.status(500).json({ error: "Failed to create document" });
        }
    }
);

app.put(
    "/api/documents/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                category,
                keywords,
                knowledge_owner,
                publication_date,
                review_date,
                version_number,
                status,
                file_url,
            } = req.body;

            if (!title || !title.trim()) {
                return res
                    .status(400)
                    .json({ error: "Document title is required" });
            }

            const result = await pool.query(
                `UPDATE documents
                 SET title = $1, description = $2, category = $3, keywords = $4,
                     knowledge_owner = $5, publication_date = $6, review_date = $7,
                     version_number = $8, status = $9, file_url = $10
                 WHERE id = $11
                 RETURNING *`,
                [
                    title.trim(),
                    description || null,
                    category || "DOCUMENT",
                    keywords || "",
                    knowledge_owner || null,
                    publication_date || null,
                    review_date || null,
                    version_number || "v1.0",
                    status || "Published",
                    file_url || null,
                    id,
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Document not found" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error updating document:", error);
            res.status(500).json({ error: "Failed to update document" });
        }
    }
);

app.delete(
    "/api/documents/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM documents WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Document not found" });
            }

            res.json({
                message: "Document deleted successfully",
                document: result.rows[0],
            });
        } catch (error) {
            console.error("Error deleting document:", error);
            res.status(500).json({ error: "Failed to delete document" });
        }
    }
);

// ============================================================
// POLICIES - Admin-managed content
// ============================================================

app.get("/api/policies", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM policies ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching policies:", error);
        res.status(500).json({ error: "Failed to fetch policies" });
    }
});

app.get("/api/policies/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM policies WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Policy not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching policy:", error);
        res.status(500).json({ error: "Failed to fetch policy" });
    }
});

app.post(
    "/api/policies",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                policy_number,
                description,
                category,
                author,
                publication_date,
                review_date,
                status,
                file_url,
            } = req.body;

            if (!title) {
                return res
                    .status(400)
                    .json({ error: "Policy title is required" });
            }

            const result = await pool.query(
                `INSERT INTO policies (
                    title, policy_number, description, category, author,
                    publication_date, review_date, status, file_url
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
                [
                    title,
                    policy_number || null,
                    description || null,
                    category || "Policy",
                    author || null,
                    publication_date || null,
                    review_date || null,
                    status || "draft",
                    file_url || null,
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error creating policy:", error);
            res.status(500).json({ error: "Failed to create policy" });
        }
    }
);

app.put(
    "/api/policies/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const {
                title,
                policy_number,
                description,
                category,
                author,
                publication_date,
                review_date,
                status,
                file_url,
            } = req.body;

            if (!title) {
                return res
                    .status(400)
                    .json({ error: "Policy title is required" });
            }

            const result = await pool.query(
                `UPDATE policies
                 SET title = $1, policy_number = $2, description = $3, category = $4,
                     author = $5, publication_date = $6, review_date = $7,
                     status = $8, file_url = $9
                 WHERE id = $10
                 RETURNING *`,
                [
                    title,
                    policy_number || null,
                    description || null,
                    category || "Policy",
                    author || null,
                    publication_date || null,
                    review_date || null,
                    status || "draft",
                    file_url || null,
                    id,
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error updating policy:", error);
            res.status(500).json({ error: "Failed to update policy" });
        }
    }
);

app.delete(
    "/api/policies/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM policies WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Policy not found" });
            }

            res.json({
                message: "Policy deleted successfully",
                policy: result.rows[0],
            });
        } catch (error) {
            console.error("Error deleting policy:", error);
            res.status(500).json({ error: "Failed to delete policy" });
        }
    }
);

// ============================================================
// FAQs - Admin-managed content
// ============================================================

app.get("/api/faqs", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM faqs ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
});

app.post("/api/faqs", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { question, answer, category, keywords, status } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({
                error: "Question, answer, and category are required.",
            });
        }

        const result = await pool.query(
            `INSERT INTO faqs
                (question, answer, category, keywords, status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [question, answer, category, keywords || "", status || "draft"]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ error: "Failed to create FAQ" });
    }
});

app.put("/api/faqs/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, keywords, status } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({
                error: "Question, answer, and category are required.",
            });
        }

        const result = await pool.query(
            `UPDATE faqs
             SET question = $1, answer = $2, category = $3, keywords = $4,
                 status = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [question, answer, category, keywords || "", status || "draft", id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "FAQ not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ error: "Failed to update FAQ" });
    }
});

app.delete(
    "/api/faqs/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM faqs WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "FAQ not found" });
            }

            res.json({ message: "FAQ deleted successfully", faq: result.rows[0] });
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            res.status(500).json({ error: "Failed to delete FAQ" });
        }
    }
);

// ============================================================
// CIRCULUS - Admin-managed content
// ============================================================

app.get("/api/circulus", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM circulus ORDER BY publication_date DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching circulus:", error);
        res.status(500).json({ error: "Failed to fetch circulus" });
    }
});

app.post(
    "/api/circulus",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                description,
                category,
                author,
                publication_date,
                file_url,
                status,
            } = req.body;

            if (!title || !title.trim()) {
                return res
                    .status(400)
                    .json({ error: "Circulus title is required" });
            }

            const result = await pool.query(
                `INSERT INTO circulus (
                    title, description, category, author, publication_date,
                    file_url, status, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING *`,
                [
                    title.trim(),
                    description || null,
                    category || "Circulars",
                    author || null,
                    publication_date || null,
                    file_url || null,
                    status || "Published",
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error creating circulus:", error);
            res.status(500).json({ error: "Failed to create circulus" });
        }
    }
);

app.put(
    "/api/circulus/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                category,
                author,
                publication_date,
                file_url,
                status,
            } = req.body;

            if (!title || !title.trim()) {
                return res
                    .status(400)
                    .json({ error: "Circulus title is required" });
            }

            const result = await pool.query(
                `UPDATE circulus
                 SET title = $1, description = $2, category = $3, author = $4,
                     publication_date = $5, file_url = $6, status = $7, updated_at = NOW()
                 WHERE id = $8
                 RETURNING *`,
                [
                    title.trim(),
                    description || null,
                    category || "Circulars",
                    author || null,
                    publication_date || null,
                    file_url || null,
                    status || "Published",
                    id,
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Circulus not found" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error updating circulus:", error);
            res.status(500).json({ error: "Failed to update circulus" });
        }
    }
);

app.delete(
    "/api/circulus/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM circulus WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Circulus not found" });
            }

            res.json({
                message: "Circulus deleted successfully",
                circulus: result.rows[0],
            });
        } catch (error) {
            console.error("Error deleting circulus:", error);
            res.status(500).json({ error: "Failed to delete circulus" });
        }
    }
);

// ============================================================
// EMPLOYEES (Staff Directory + Employee Management)
// Read: any authenticated staff member. Write: Admin only.
// ============================================================

app.get("/api/employees", authenticateToken, async (req, res) => {
    try {
        const {
            search,
            department,
            skill,
            mentorOnly,
            status,
            page = 1,
            limit = 10,
        } = req.query;

        const conditions = [];
        const values = [];

        if (search) {
            values.push(`%${search}%`);
            const i = values.length;
            conditions.push(
                `(full_name ILIKE $${i} OR first_name ILIKE $${i} OR surname ILIKE $${i}
                  OR position ILIKE $${i} OR programme ILIKE $${i} OR email ILIKE $${i}
                  OR EXISTS (SELECT 1 FROM unnest(skills) s WHERE s ILIKE $${i}))`
            );
        }

        if (department && department !== "all") {
            values.push(department);
            conditions.push(`programme = $${values.length}`);
        }

        if (skill && skill !== "all") {
            values.push(skill);
            conditions.push(
                `EXISTS (SELECT 1 FROM unnest(skills) s WHERE s = $${values.length})`
            );
        }

        if (mentorOnly === "true") {
            conditions.push("is_mentor = TRUE");
        }

        if (status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
        } else {
            conditions.push("status <> 'Inactive'");
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const offset = (safePage - 1) * safeLimit;

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM employees ${whereClause}`,
            values
        );
        const totalItems = parseInt(countResult.rows[0].count, 10);

        values.push(safeLimit);
        values.push(offset);

        const dataResult = await pool.query(
            `SELECT id, first_name, surname, full_name, initials, email, phone,
                    location, programme, subprogramme, position, department_id,
                    is_mentor, skills, experience, status, created_date
             FROM employees
             ${whereClause}
             ORDER BY surname ASC, first_name ASC
             LIMIT $${values.length - 1} OFFSET $${values.length}`,
            values
        );

        const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

        res.json({
            data: dataResult.rows,
            pagination: {
                currentPage: safePage,
                itemsPerPage: safeLimit,
                totalItems,
                totalPages,
                hasNext: safePage < totalPages,
                hasPrev: safePage > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});

app.get("/api/employees/departments-list", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT programme FROM employees
             WHERE programme IS NOT NULL AND programme <> '' ORDER BY programme`
        );
        res.json(result.rows.map((row) => row.programme));
    } catch (error) {
        console.error("Error fetching employee departments:", error);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

app.get("/api/employees/skills-list", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT unnest(skills) AS skill FROM employees ORDER BY skill`
        );
        res.json(result.rows.map((row) => row.skill).filter(Boolean));
    } catch (error) {
        console.error("Error fetching employee skills:", error);
        res.status(500).json({ error: "Failed to fetch skills" });
    }
});

app.get("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM employees WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ error: "Failed to fetch employee" });
    }
});

app.post(
    "/api/employees",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                id,
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position,
                phone,
                location,
                department_id,
                is_mentor,
                skills,
                experience,
            } = req.body;

            if (!id || !first_name || !surname) {
                return res.status(400).json({
                    error: "Employee id, first name and surname are required.",
                });
            }

            const existing = await pool.query(
                "SELECT id FROM employees WHERE id = $1",
                [id]
            );

            if (existing.rows.length > 0) {
                return res
                    .status(409)
                    .json({ error: "An employee with this id already exists." });
            }

            const fullName = `${first_name} ${surname}`.trim();
            const initials = `${first_name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

            const result = await pool.query(
                `INSERT INTO employees (
                    id, first_name, surname, full_name, initials, email, programme,
                    subprogramme, position, phone, location, department_id,
                    is_mentor, skills, experience, status, created_date, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'Active', NOW(), NOW())
                RETURNING *`,
                [
                    id,
                    first_name,
                    surname,
                    fullName,
                    initials,
                    email || null,
                    programme || null,
                    subprogramme || null,
                    position || null,
                    phone || null,
                    location || null,
                    department_id || null,
                    is_mentor ?? false,
                    Array.isArray(skills) ? skills : [],
                    experience || null,
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error creating employee:", error);
            res.status(500).json({ error: "Failed to create employee" });
        }
    }
);

app.put(
    "/api/employees/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const {
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position,
                phone,
                location,
                department_id,
                is_mentor,
                skills,
                experience,
                status,
            } = req.body;

            if (!first_name || !surname) {
                return res.status(400).json({
                    error: "First name and surname are required.",
                });
            }

            const fullName = `${first_name} ${surname}`.trim();

            const result = await pool.query(
                `UPDATE employees
                 SET first_name = $1, surname = $2, full_name = $3, email = $4,
                     programme = $5, subprogramme = $6, position = $7, phone = $8,
                     location = $9, department_id = $10, is_mentor = $11,
                     skills = $12, experience = $13,
                     status = COALESCE($14, status), updated_at = NOW()
                 WHERE id = $15
                 RETURNING *`,
                [
                    first_name,
                    surname,
                    fullName,
                    email || null,
                    programme || null,
                    subprogramme || null,
                    position || null,
                    phone || null,
                    location || null,
                    department_id || null,
                    is_mentor ?? false,
                    Array.isArray(skills) ? skills : [],
                    experience || null,
                    status || null,
                    id,
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Employee not found" });
            }

            // Keep the matching users row (if any) in sync on name/profile fields.
            await pool.query(
                `UPDATE users
                 SET first_name = $1, surname = $2, programme = $3,
                     subprogramme = $4, position = $5, updated_at = NOW()
                 WHERE employee_id = $6`,
                [first_name, surname, programme || null, subprogramme || null, position || null, id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error updating employee:", error);
            res.status(500).json({ error: "Failed to update employee" });
        }
    }
);

app.delete(
    "/api/employees/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            // Soft delete: employee history and any linked user account must
            // survive (payroll/HR traceability), so we deactivate rather than
            // DELETE the row.
            const result = await pool.query(
                `UPDATE employees
                 SET status = 'Inactive', updated_at = NOW()
                 WHERE id = $1
                 RETURNING *`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Employee not found" });
            }

            res.json({
                message: "Employee deactivated successfully",
                employee: result.rows[0],
            });
        } catch (error) {
            console.error("Error deactivating employee:", error);
            res.status(500).json({ error: "Failed to deactivate employee" });
        }
    }
);

// ============================================================
// DEPARTMENTS
// ============================================================

app.get("/api/departments", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.*,
                    (SELECT COUNT(*) FROM employees e
                     WHERE e.department_id = d.id AND e.status <> 'Inactive') AS employee_count
             FROM departments d
             ORDER BY d.name ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

app.post(
    "/api/departments",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name || !name.trim()) {
                return res
                    .status(400)
                    .json({ error: "Department name is required." });
            }

            const existing = await pool.query(
                "SELECT id FROM departments WHERE LOWER(name) = LOWER($1)",
                [name.trim()]
            );

            if (existing.rows.length > 0) {
                return res
                    .status(409)
                    .json({ error: "A department with this name already exists." });
            }

            const result = await pool.query(
                `INSERT INTO departments (name, description, status, created_at, updated_at)
                 VALUES ($1, $2, 'Active', NOW(), NOW())
                 RETURNING *`,
                [name.trim(), description || null]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error creating department:", error);
            res.status(500).json({ error: "Failed to create department" });
        }
    }
);

app.put(
    "/api/departments/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;

            if (!name || !name.trim()) {
                return res
                    .status(400)
                    .json({ error: "Department name is required." });
            }

            const result = await pool.query(
                `UPDATE departments
                 SET name = $1, description = $2, status = COALESCE($3, status), updated_at = NOW()
                 WHERE id = $4
                 RETURNING *`,
                [name.trim(), description || null, status || null, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Department not found" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error updating department:", error);
            res.status(500).json({ error: "Failed to update department" });
        }
    }
);

app.delete(
    "/api/departments/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const activeEmployees = await pool.query(
                `SELECT COUNT(*) FROM employees
                 WHERE department_id = $1 AND status <> 'Inactive'`,
                [id]
            );

            if (parseInt(activeEmployees.rows[0].count, 10) > 0) {
                return res.status(409).json({
                    error:
                        "This department still has active employees assigned to it. Reassign or deactivate them first.",
                });
            }

            const result = await pool.query(
                `UPDATE departments
                 SET status = 'Inactive', updated_at = NOW()
                 WHERE id = $1
                 RETURNING *`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Department not found" });
            }

            res.json({
                message: "Department deactivated successfully",
                department: result.rows[0],
            });
        } catch (error) {
            console.error("Error deactivating department:", error);
            res.status(500).json({ error: "Failed to deactivate department" });
        }
    }
);

// ============================================================
// USERS (legacy public directory list - unchanged)
// ============================================================

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT first_name, surname, email, programme, subprogramme, position, created_date
             FROM users
             ORDER BY surname ASC, first_name ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// ============================================================
// ADMIN: USER MANAGEMENT (accounts, roles, activation)
// ============================================================

app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, employee_id, first_name, surname, email, programme,
                    subprogramme, position, role, is_active, must_reset_password,
                    last_login_at, created_date
             FROM users
             ORDER BY surname ASC, first_name ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching admin user list:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.put(
    "/api/admin/users/:id/role",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!VALID_ROLES.includes(role)) {
                return res.status(400).json({
                    error: `Role must be one of: ${VALID_ROLES.join(", ")}`,
                });
            }

            const target = await pool.query(
                "SELECT id, role FROM users WHERE id = $1",
                [id]
            );

            if (target.rows.length === 0) {
                return res.status(404).json({ error: "User not found." });
            }

            if (target.rows[0].role === "Admin" && role !== "Admin") {
                const adminCount = await pool.query(
                    "SELECT COUNT(*) FROM users WHERE role = 'Admin' AND is_active = TRUE"
                );

                if (parseInt(adminCount.rows[0].count, 10) <= 1) {
                    return res.status(409).json({
                        error:
                            "Cannot remove the last active Admin account. Promote another user first.",
                    });
                }
            }

            const result = await pool.query(
                `UPDATE users SET role = $1, updated_at = NOW()
                 WHERE id = $2
                 RETURNING id, first_name, surname, email, role, is_active`,
                [role, id]
            );

            res.json({ message: "Role updated successfully.", user: result.rows[0] });
        } catch (error) {
            console.error("Error updating user role:", error);
            res.status(500).json({ error: "Failed to update role." });
        }
    }
);

app.put(
    "/api/admin/users/:id/status",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            if (typeof is_active !== "boolean") {
                return res
                    .status(400)
                    .json({ error: "is_active must be true or false." });
            }

            const target = await pool.query(
                "SELECT id, role FROM users WHERE id = $1",
                [id]
            );

            if (target.rows.length === 0) {
                return res.status(404).json({ error: "User not found." });
            }

            if (!is_active && target.rows[0].role === "Admin") {
                const activeAdmins = await pool.query(
                    "SELECT COUNT(*) FROM users WHERE role = 'Admin' AND is_active = TRUE"
                );

                if (parseInt(activeAdmins.rows[0].count, 10) <= 1) {
                    return res.status(409).json({
                        error:
                            "Cannot deactivate the last active Admin account.",
                    });
                }
            }

            const result = await pool.query(
                `UPDATE users SET is_active = $1, updated_at = NOW()
                 WHERE id = $2
                 RETURNING id, first_name, surname, email, role, is_active`,
                [is_active, id]
            );

            res.json({
                message: is_active
                    ? "Account activated successfully."
                    : "Account deactivated successfully.",
                user: result.rows[0],
            });
        } catch (error) {
            console.error("Error updating account status:", error);
            res.status(500).json({ error: "Failed to update account status." });
        }
    }
);

app.post(
    "/api/admin/users/invite",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { employee_id, email, role } = req.body;

            if (!employee_id && !email) {
                return res.status(400).json({
                    error: "Provide either employee_id or email to invite.",
                });
            }

            const invitedRole = VALID_ROLES.includes(role) ? role : "Employee";

            const employeeResult = await pool.query(
                employee_id
                    ? "SELECT * FROM employees WHERE id = $1"
                    : "SELECT * FROM employees WHERE LOWER(email) = LOWER($1)",
                [employee_id || email]
            );

            if (employeeResult.rows.length === 0) {
                return res.status(404).json({
                    error: "No matching employee record found.",
                });
            }

            const employee = employeeResult.rows[0];

            const existingUser = await pool.query(
                "SELECT id FROM users WHERE employee_id = $1",
                [employee.id]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({
                    error: "This employee already has an account.",
                });
            }

            const placeholderPassword = crypto.randomBytes(32).toString("hex");
            const passwordHash = await bcrypt.hash(placeholderPassword, 10);

            const newUser = await pool.query(
                `INSERT INTO users
                    (employee_id, first_name, surname, email, programme, subprogramme,
                     position, password_hash, role, is_active, must_reset_password, created_date)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE, NOW())
                 RETURNING id, first_name, surname, email, role`,
                [
                    employee.id,
                    employee.first_name,
                    employee.surname,
                    employee.email,
                    employee.programme,
                    employee.subprogramme || null,
                    employee.position || null,
                    passwordHash,
                    invitedRole,
                ]
            );

            const user = newUser.rows[0];

            const token = crypto.randomBytes(32).toString("hex");
            const tokenHash = hashToken(token);
            const expiresAt = new Date(
                Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000
            );

            await pool.query(
                `INSERT INTO password_reset_tokens (user_id, token_hash, purpose, expires_at)
                 VALUES ($1, $2, 'invite', $3)`,
                [user.id, tokenHash, expiresAt]
            );

            const delivered = await sendAccountEmail({
                to: user.email,
                subject: "Welcome to the DEDaT Intranet - set your password",
                text:
                    `Hello ${user.first_name},\n\n` +
                    `An administrator has created an intranet account for you.\n` +
                    `Set your password using this link (valid ${INVITE_TOKEN_TTL_HOURS}h):\n` +
                    `${process.env.FRONTEND_URL || ""}/#/reset-password?token=${token}\n\n` +
                    "If you did not expect this, you can ignore this email.",
            });

            res.status(201).json({
                message: delivered
                    ? "Invitation sent successfully."
                    : "Account created. Email delivery is not configured, so the reset link was logged on the server instead.",
                user,
            });
        } catch (error) {
            console.error("Error inviting user:", error);
            res.status(500).json({ error: "Failed to invite user." });
        }
    }
);

// ============================================================
// ADMIN: DASHBOARD STATISTICS
// ============================================================

app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [
            employeeTotals,
            userTotals,
            departmentTotals,
            pendingRegistrations,
            recentNews,
        ] = await Promise.all([
            pool.query(
                `SELECT COUNT(*) FILTER (WHERE status <> 'Inactive') AS active,
                        COUNT(*) AS total
                 FROM employees`
            ),
            pool.query(
                `SELECT COUNT(*) FILTER (WHERE role = 'Admin') AS admins,
                        COUNT(*) FILTER (WHERE is_active) AS active,
                        COUNT(*) AS total
                 FROM users`
            ),
            pool.query(
                `SELECT COUNT(*) FILTER (WHERE status = 'Active') AS active,
                        COUNT(*) AS total
                 FROM departments`
            ),
            pool.query(
                `SELECT COUNT(*) AS count
                 FROM employees e
                 WHERE e.status <> 'Inactive'
                 AND NOT EXISTS (SELECT 1 FROM users u WHERE u.employee_id = e.id)`
            ),
            pool.query(
                `SELECT id, title, category, created_date
                 FROM news ORDER BY created_date DESC LIMIT 5`
            ),
        ]);

        const departmentBreakdown = await pool.query(
            `SELECT d.name, COUNT(e.id) AS employee_count
             FROM departments d
             LEFT JOIN employees e ON e.department_id = d.id AND e.status <> 'Inactive'
             WHERE d.status = 'Active'
             GROUP BY d.name
             ORDER BY employee_count DESC`
        );

        res.json({
            employees: {
                active: parseInt(employeeTotals.rows[0].active, 10),
                total: parseInt(employeeTotals.rows[0].total, 10),
            },
            users: {
                total: parseInt(userTotals.rows[0].total, 10),
                active: parseInt(userTotals.rows[0].active, 10),
                admins: parseInt(userTotals.rows[0].admins, 10),
            },
            departments: {
                active: parseInt(departmentTotals.rows[0].active, 10),
                total: parseInt(departmentTotals.rows[0].total, 10),
                breakdown: departmentBreakdown.rows,
            },
            pendingRegistrations: parseInt(
                pendingRegistrations.rows[0].count,
                10
            ),
            recentNews: recentNews.rows,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: "Failed to fetch admin statistics" });
    }
});

// ============================================================
// AUTHENTICATION
// ============================================================

app.post("/api/auth/register", async (req, res) => {
    try {
        const {
            first_name,
            surname,
            email,
            programme,
            subprogramme,
            position,
            password,
        } = req.body;

        if (!first_name || !surname || !email || !password) {
            return res.status(400).json({
                error: "First name, surname, email and password are required",
            });
        }

        const employeeResult = await pool.query(
            `SELECT id, first_name, surname, email, programme, subprogramme, position
             FROM employees
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                error:
                    "Employee record not found. Please use your registered government email address.",
            });
        }

        const employee = employeeResult.rows[0];

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE employee_id = $1",
            [employee.id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: "This employee already has an account.",
            });
        }

        const existingEmail = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
            [email]
        );

        if (existingEmail.rows.length > 0) {
            return res.status(409).json({
                error: "A user with this email already exists.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Self-registration is always Employee-level. There is no client
        // input anywhere in this request that can grant Admin - role
        // escalation only happens through PUT /api/admin/users/:id/role.
        const result = await pool.query(
            `INSERT INTO users
                (employee_id, first_name, surname, email, programme, subprogramme,
                 position, password_hash, role, is_active, created_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, NOW())
             RETURNING id, employee_id, first_name, surname, email, programme,
                       subprogramme, position, role, created_date`,
            [
                employee.id,
                employee.first_name,
                employee.surname,
                employee.email,
                employee.programme,
                employee.subprogramme || null,
                employee.position || null,
                passwordHash,
                "Employee",
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!user.is_active) {
            return res.status(403).json({
                error: "This account has been deactivated. Contact an administrator.",
            });
        }

        if (user.must_reset_password) {
            return res.status(403).json({
                error:
                    "This account must set a password before logging in. Use the password reset link sent to you.",
                mustResetPassword: true,
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env");
            return res
                .status(500)
                .json({ error: "Authentication configuration error" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                employee_id: user.employee_id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        await pool.query(
            "UPDATE users SET last_login_at = NOW() WHERE id = $1",
            [user.id]
        );

        delete user.password_hash;

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const result = await pool.query(
            "SELECT id, first_name, email FROM users WHERE LOWER(email) = LOWER($1)",
            [email]
        );

        // Always respond the same way whether or not the account exists,
        // so this endpoint cannot be used to enumerate valid staff emails.
        const genericResponse = {
            message:
                "If that email has an account, a password reset link has been sent.",
        };

        if (result.rows.length === 0) {
            return res.json(genericResponse);
        }

        const user = result.rows[0];

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashToken(token);
        const expiresAt = new Date(
            Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000
        );

        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token_hash, purpose, expires_at)
             VALUES ($1, $2, 'reset', $3)`,
            [user.id, tokenHash, expiresAt]
        );

        await sendAccountEmail({
            to: user.email,
            subject: "DEDaT Intranet password reset",
            text:
                `Hello ${user.first_name},\n\n` +
                `A password reset was requested for your account. This link is valid for ` +
                `${RESET_TOKEN_TTL_HOURS} hour(s):\n` +
                `${process.env.FRONTEND_URL || ""}/#/reset-password?token=${token}\n\n` +
                "If you did not request this, you can ignore this email.",
        });

        res.json(genericResponse);
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Failed to process password reset request." });
    }
});

app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res
                .status(400)
                .json({ error: "Token and new password are required." });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({ error: "Password must be at least 8 characters long." });
        }

        const tokenHash = hashToken(token);

        const tokenResult = await pool.query(
            `SELECT id, user_id, expires_at, used_at FROM password_reset_tokens
             WHERE token_hash = $1`,
            [tokenHash]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        const resetToken = tokenResult.rows[0];

        if (resetToken.used_at) {
            return res.status(400).json({ error: "This token has already been used." });
        }

        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({ error: "This token has expired." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `UPDATE users
             SET password_hash = $1, must_reset_password = FALSE, updated_at = NOW()
             WHERE id = $2`,
            [passwordHash, resetToken.user_id]
        );

        await pool.query(
            "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
            [resetToken.id]
        );

        res.json({ message: "Password updated successfully. You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Failed to reset password." });
    }
});

// ============================================================
// UPDATE USER PROFILE
// Owner or Admin only - fixes the previous "any token can edit any id" gap.
// ============================================================

app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;

        if (
            String(req.user.id) !== String(userId) &&
            req.user.role !== "Admin"
        ) {
            return res.status(403).json({
                error: "You can only edit your own profile.",
            });
        }

        const { first_name, surname, programme, subprogramme, position } =
            req.body;

        if (!first_name || !surname) {
            return res
                .status(400)
                .json({ error: "First name and surname are required." });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [userId]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const result = await pool.query(
            `UPDATE users
             SET first_name = $1, surname = $2, programme = $3, subprogramme = $4,
                 position = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING id, employee_id, first_name, surname, email, programme,
                       subprogramme, position, role, created_date`,
            [first_name, surname, programme || null, subprogramme || null, position || null, userId]
        );

        res.json({
            message: "Profile updated successfully.",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile." });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`DEDAT backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
