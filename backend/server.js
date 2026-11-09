const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const app = express();
const PORT = 5000;



// ============================================================
// PASSWORD RESET EMAIL CONFIGURATION
// ============================================================

const emailTransporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


// ============================================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access denied. No authentication token provided."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            error: "Invalid or expired authentication token."
        });

    }
}

function requireAdmin(req, res, next) {
    authenticateToken(req, res, () => {
        if (String(req.user.role || "").toLowerCase() !== "admin") {
            return res.status(403).json({ error: "Administrator access is required." });
        }
        next();
    });
}

function requireAdminOrBoardroomBooking(req, res, next) {
    authenticateToken(req, res, () => {
        if (
            String(req.user.role || "").toLowerCase() === "admin" ||
            req.body.category === "Boardroom"
        ) {
            return next();
        }
        return res.status(403).json({ error: "Administrator access is required." });
    });
}

function validateNumericId(req, res, next) {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ error: "Record identifier must be numeric." });
    }
    next();
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "DEDAT Intranet Backend is running"
    });
});

app.get("/api/news", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(
    "SELECT * FROM news ORDER BY created_date DESC"
);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({
            error: "Failed to fetch news"
        });
    }
});

// ============================================================
// CREATE NEWS
// ============================================================

app.post("/api/news", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content_markdown,
            category,
            author,
            publication_date,
            image_url,
            is_featured
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "News title is required"
            });
        }

        if (!content_markdown || !content_markdown.trim()) {
            return res.status(400).json({
                error: "News Markdown content is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO news (
                title,
                excerpt,
                content_markdown,
                category,
                author,
                publication_date,
                image_url,
                is_featured,
                created_date,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *`,
            [
                title.trim(),
                excerpt || null,
                content_markdown.trim(),
                category || "News",
                author || null,
                publication_date || null,
                image_url || null,
                is_featured ?? false
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating news:", error);

        res.status(500).json({
            error: "Failed to create news"
        });
    }
});

// ============================================================
// WELLNESS VIDEOS
// ============================================================

app.get("/api/wellness", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                category,
                duration,
                thumbnail,
                video_url,
                featured,
                created_date
             FROM wellness_videos
             ORDER BY created_date DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Wellness API error:", error);

        res.status(500).json({
            error: "Failed to fetch wellness videos"
        });
    }
});

// ============================================================
// WELLNESS VIDEOS
// ============================================================

// ============================================================
// CREATE WELLNESS VIDEO
// ============================================================

app.post("/api/wellness", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            duration,
            thumbnail,
            video_url,
            featured
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Wellness video title is required." });
        }

        const result = await pool.query(
            `INSERT INTO wellness_videos
                (
                    title,
                    description,
                    category,
                    duration,
                    thumbnail,
                    video_url,
                    featured
                )
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING
                id,
                title,
                description,
                category,
                duration,
                thumbnail,
                video_url,
                featured,
                created_date`,
            [
                title,
                description || "",
                category || "Mental Health",
                duration || "",
                thumbnail || "",
                video_url || "",
                featured ?? false
            ]
        );

        // Check what PostgreSQL inserted
        console.log("WELLNESS INSERTED:", result.rows[0]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Create wellness video API error:", error);

        res.status(500).json({
            error: "Failed to create wellness video"
        });
    }
});

// ============================================================
// CALENDAR EVENTS
// ============================================================

// GET calendar events
app.get("/api/calendar-events", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM calendar_events ORDER BY start_time ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching calendar events:", error);

        res.status(500).json({
            error: "Failed to fetch calendar events"
        });
    }
});


// ============================================================
// CREATE CALENDAR EVENT
// ============================================================

app.post("/api/calendar-events", requireAdminOrBoardroomBooking, async (req, res) => {
    try {
        const {
            title,
            description,
            start_time,
            end_time,
            category,
            quarter
        } = req.body;

        // Check required fields
        if (!title || !title.trim() || !start_time || !end_time) {
            return res.status(400).json({
                error: "Title, start time and end time are required"
            });
        }

        // Make sure the end time is after the start time
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);
        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime()) ||
            endDate <= startDate
        ) {
            return res.status(400).json({
                error: "End time must be after start time"
            });
        }

        // Use Meeting as the default category
        const eventCategory = category || "Meeting";


        // ========================================================
        // BOARDROOM CONFLICT CHECK
        // Only Boardroom bookings need this check
        // ========================================================

        if (eventCategory === "Boardroom") {

            const conflict = await pool.query(
                `SELECT *
                 FROM calendar_events
                 WHERE category = 'Boardroom'
                 AND start_time < $2
                 AND end_time > $1`,
                [start_time, end_time]
            );

            // If another Boardroom booking overlaps, reject it
            if (conflict.rows.length > 0) {
                return res.status(409).json({
                    error: "The boardroom is already booked for this time."
                });
            }
        }


        // ========================================================
        // CREATE EVENT
        // ========================================================

        const result = await pool.query(
            `INSERT INTO calendar_events
            (
                title,
                description,
                start_time,
                end_time,
                category,
                quarter
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                title,
                description || null,
                start_time,
                end_time,
                eventCategory,
                quarter || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error saving calendar event:", error);

        res.status(500).json({
            error: "Failed to save calendar event"
        });
    }
});

// ============================================================
// DOCUMENTS
// ============================================================

// GET all documents
app.get("/api/documents", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM documents
             WHERE LOWER(status) = 'published'
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching documents:", error);

        res.status(500).json({
            error: "Failed to fetch documents"
        });
    }
});


// GET single document
app.get("/api/documents/:id", authenticateToken, validateNumericId, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM documents
             WHERE id = $1 AND LOWER(status) = 'published'`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching document:", error);

        res.status(500).json({
            error: "Failed to fetch document"
        });
    }
});


// CREATE document
app.post("/api/documents", requireAdmin, async (req, res) => {
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
            file_url
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Document title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO documents (
                title,
                description,
                category,
                keywords,
                knowledge_owner,
                publication_date,
                review_date,
                version_number,
                status,
                file_url
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10
            )
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
                file_url || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating document:", error);

        res.status(500).json({
            error: "Failed to create document"
        });
    }
});


// UPDATE document
app.put("/api/documents/:id", validateNumericId, requireAdmin, async (req, res) => {
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
            file_url
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Document title is required"
            });
        }

        const result = await pool.query(
            `UPDATE documents
             SET
                title = $1,
                description = $2,
                category = $3,
                keywords = $4,
                knowledge_owner = $5,
                publication_date = $6,
                review_date = $7,
                version_number = $8,
                status = $9,
                file_url = $10
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
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error updating document:", error);

        res.status(500).json({
            error: "Failed to update document"
        });
    }
});


// DELETE document
app.delete("/api/documents/:id", validateNumericId, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM documents
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json({
            message: "Document deleted successfully",
            document: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting document:", error);

        res.status(500).json({
            error: "Failed to delete document"
        });
    }
});




// GET policies
app.get("/api/policies", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM policies WHERE LOWER(status) = 'published' ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching policies:", error);
        res.status(500).json({
            error: "Failed to fetch policies"
        });
    }
});

// CREATE policy
app.post("/api/policies", requireAdmin, async (req, res) => {
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
            file_url
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Policy title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO policies (
                title,
                policy_number,
                description,
                category,
                author,
                publication_date,
                review_date,
                status,
                file_url
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
                file_url || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating policy:", error);

        res.status(500).json({
            error: "Failed to create policy"
        });
    }
});
// =========================================================
// FAQs
// =========================================================

// GET FAQs
app.get("/api/faqs", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM faqs WHERE LOWER(status) = 'published' ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching FAQs:", error);

        res.status(500).json({
            error: "Failed to fetch FAQs"
        });
    }
});


// POST FAQ
app.post("/api/faqs", requireAdmin, async (req, res) => {
    try {
        const {
            question,
            answer,
            category,
            keywords,
            status
        } = req.body;

        // Validate required fields
        if (
            !question || !question.trim() ||
            !answer || !answer.trim() ||
            !category || !category.trim()
        ) {
            return res.status(400).json({
                error: "Question, answer, and category are required."
            });
        }

        const result = await pool.query(
            `INSERT INTO faqs
            (
                question,
                answer,
                category,
                keywords,
                status,
                created_at,
                updated_at
            )
            VALUES
            ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *`,
            [
                question,
                answer,
                category,
                keywords || "",
                status || "draft"
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating FAQ:", error);

        res.status(500).json({
            error: "Failed to create FAQ"
        });
    }
});

// GET circulus
app.get("/api/circulus", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM circulus WHERE LOWER(status) = 'published' ORDER BY publication_date DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching circulus:", error);
        res.status(500).json({
            error: "Failed to fetch circulus"
        });
    }
});

// ============================================================
// CREATE CIRCULUS
// ============================================================

app.post("/api/circulus", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            author,
            publication_date,
            file_url,
            status
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Circulus title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO circulus (
                title,
                description,
                category,
                author,
                publication_date,
                file_url,
                status,
                created_at,
                updated_at
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
                status || "Published"
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating circulus:", error);

        res.status(500).json({
            error: "Failed to create circulus"
        });
    }
});

// GET users
app.get("/api/users", requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT first_name, surname, email, programme, subprogramme, position, created_date
             FROM users
             ORDER BY surname ASC, first_name ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

app.get("/api/staff", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, first_name, surname, email, programme, subprogramme, position
             FROM employees
             ORDER BY surname ASC, first_name ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching staff directory:", error);
        res.status(500).json({ error: "Failed to fetch staff directory" });
    }
});

app.get("/api/site-content/:slug", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT slug, title, description, image_url, content, updated_at
             FROM site_content
             WHERE slug = $1`,
            [req.params.slug]
        );
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error("Error fetching site content:", error);
        res.status(500).json({ error: "Failed to fetch site content" });
    }
});

// ============================================================
// AUTHENTICATION
// ============================================================

// REGISTER USER
app.post("/api/auth/register", async (req, res) => {
    try {
        const {
            first_name,
            surname,
            email,
            programme,
            subprogramme,
            position,
            password
        } = req.body;

        // Check required fields
        if (!first_name || !surname || !email || !password) {
            return res.status(400).json({
                error: "First name, surname, email and password are required"
            });
        }

        // Check if employee exists
        const employeeResult = await pool.query(
            `SELECT
                id,
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position
             FROM employees
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                error: "Employee record not found. Please use your registered government email address."
            });
        }

        const employee = employeeResult.rows[0];

        // Check if this employee already has an account
        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE employee_id = $1`,
            [employee.id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: "This employee already has an account."
            });
        }

        // Check if email already exists
        const existingEmail = await pool.query(
            `SELECT id
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (existingEmail.rows.length > 0) {
            return res.status(409).json({
                error: "A user with this email already exists."
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user using the employee's existing ID
        const result = await pool.query(
            `INSERT INTO users
            (
                employee_id,
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position,
                password_hash,
                role,
                created_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING
                id,
                employee_id,
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position,
                role,
                created_date`,
            [
                employee.id,
                employee.first_name,
                employee.surname,
                employee.email,
                employee.programme,
                employee.subprogramme || null,
                employee.position || null,
                passwordHash,
                "Employee"
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            error: "Failed to register user"
        });
    }
});


// LOGIN USER
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user
        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Make sure JWT secret exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env");

            return res.status(500).json({
                error: "Authentication configuration error"
            });
        }

        // Create token
        const token = jwt.sign(
            {
                id: user.id,
                employee_id: user.employee_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        // Do not send password_hash to React
        delete user.password_hash;

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            error: "Failed to login"
        });
    }
});


// ============================================================
// UPDATE USER PROFILE
// ============================================================

app.put(
    "/api/users/:id",
    authenticateToken,
    async (req, res) => {
    try {

        const userId = req.params.id;

        if (
            String(req.user.role || "").toLowerCase() !== "admin" &&
            String(req.user.id) !== String(userId)
        ) {
            return res.status(403).json({
                error: "You can only update your own profile."
            });
        }

        const {
            first_name,
            surname,
            programme,
            subprogramme,
            position
        } = req.body;


        // Check required fields
        if (!first_name || !surname) {
            return res.status(400).json({
                error: "First name and surname are required."
            });
        }


        // Check that the user exists
        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE id = $1`,
            [userId]
        );


        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                error: "User not found."
            });
        }


        // Update profile
        const result = await pool.query(
            `UPDATE users
             SET
                first_name = $1,
                surname = $2,
                programme = $3,
                subprogramme = $4,
                position = $5
             WHERE id = $6
             RETURNING
                id,
                employee_id,
                first_name,
                surname,
                email,
                programme,
                subprogramme,
                position,
                role,
                created_date`,
            [
                first_name,
                surname,
                programme || null,
                subprogramme || null,
                position || null,
                userId
            ]
        );


        res.json({
            message: "Profile updated successfully.",
            user: result.rows[0]
        });


    } catch (error) {

        console.error("Update profile error:", error);

        res.status(500).json({
            error: "Failed to update profile."
        });

    }
});

const adminContentResources = {
    news: {
        table: "news",
        key: "id",
        fields: ["title", "excerpt", "content_markdown", "category", "author", "publication_date", "image_url", "is_featured"],
        required: ["title"],
        order: "created_date DESC",
        touch: "updated_at",
    },
    wellness: {
        table: "wellness_videos",
        key: "id",
        fields: ["title", "description", "category", "duration", "thumbnail", "video_url", "featured"],
        required: ["title"],
        order: "created_date DESC",
    },
    calendar: {
        table: "calendar_events",
        key: "id",
        fields: ["title", "description", "start_time", "end_time", "category", "quarter"],
        required: ["title", "start_time", "end_time"],
        order: "start_time ASC",
    },
    documents: {
        table: "documents",
        key: "id",
        fields: ["title", "description", "category", "keywords", "knowledge_owner", "publication_date", "review_date", "version_number", "status", "file_url"],
        required: ["title"],
        order: "created_at DESC",
    },
    policies: {
        table: "policies",
        key: "id",
        fields: ["title", "policy_number", "description", "category", "author", "publication_date", "review_date", "status", "file_url"],
        required: ["title"],
        order: "created_at DESC",
    },
    faqs: {
        table: "faqs",
        key: "id",
        fields: ["question", "answer", "category", "keywords", "status"],
        required: ["question", "answer", "category"],
        order: "created_at DESC",
        touch: "updated_at",
    },
    circulus: {
        table: "circulus",
        key: "id",
        fields: ["title", "description", "category", "author", "publication_date", "file_url", "status"],
        required: ["title"],
        order: "created_at DESC",
        touch: "updated_at",
    },
    site: {
        table: "site_content",
        key: "slug",
        fields: ["slug", "title", "description", "image_url", "content"],
        required: ["slug", "title"],
        order: "slug ASC",
        touch: "updated_at",
    },
    employees: {
        table: "employees",
        key: "id",
        fields: ["id", "first_name", "surname", "email", "programme", "subprogramme", "position"],
        required: ["id", "first_name", "surname"],
        order: "surname ASC, first_name ASC",
    },
};

app.get("/api/admin/content/:collection", requireAdmin, async (req, res) => {
    const resource = adminContentResources[req.params.collection];
    if (!resource) {
        return res.status(404).json({ error: "Unknown content collection." });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM ${resource.table} ORDER BY ${resource.order}`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching admin content ${req.params.collection}:`, error);
        res.status(500).json({ error: "Failed to fetch content." });
    }
});

app.post("/api/admin/content/:collection", requireAdmin, async (req, res) => {
    const resource = adminContentResources[req.params.collection];
    if (!resource) {
        return res.status(404).json({ error: "Unknown content collection." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const fields = resource.fields.filter((field) =>
        Object.prototype.hasOwnProperty.call(body, field)
    );
    const missing = resource.required.some((field) => {
        const value = body[field];
        return value === undefined || value === null || String(value).trim() === "";
    });
    if (missing) {
        return res.status(400).json({ error: "Required content fields are missing." });
    }
    if (fields.length === 0) {
        return res.status(400).json({ error: "No editable content fields were provided." });
    }
    if (req.params.collection === "calendar") {
        const start = new Date(body.start_time);
        const end = new Date(body.end_time);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({ error: "Event end time must be after its valid start time." });
        }
    }
    if (req.params.collection === "site" && String(body.slug).length > 100) {
        return res.status(400).json({ error: "Section key must be 100 characters or fewer." });
    }
    if (
        req.params.collection === "site" &&
        body.content !== undefined &&
        (typeof body.content !== "object" || body.content === null || Array.isArray(body.content))
    ) {
        return res.status(400).json({ error: "Section content must be a JSON object." });
    }
    if (req.params.collection === "employees" && !/^\d+$/.test(String(body.id))) {
        return res.status(400).json({ error: "Employee ID must be numeric." });
    }

    try {
        const values = fields.map((field) => body[field]);
        const placeholders = fields.map((_, index) => `$${index + 1}`);
        const result = await pool.query(
            `INSERT INTO ${resource.table} (${fields.join(", ")})
             VALUES (${placeholders.join(", ")})
             RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ error: "A record with that identifier already exists." });
        }
        console.error(`Error creating admin content ${req.params.collection}:`, error);
        res.status(500).json({ error: "Failed to create content." });
    }
});

app.put("/api/admin/content/:collection/:id", requireAdmin, async (req, res) => {
    const resource = adminContentResources[req.params.collection];
    if (!resource) {
        return res.status(404).json({ error: "Unknown content collection." });
    }
    const id = req.params.id;
    if (resource.key === "id" && !/^\d+$/.test(id)) {
        return res.status(400).json({ error: "Content identifier is invalid." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const fields = resource.fields.filter((field) =>
        field !== resource.key &&
        Object.prototype.hasOwnProperty.call(body, field)
    );
    if (fields.length === 0) {
        return res.status(400).json({ error: "No editable content fields were provided." });
    }
    if (resource.required.some((field) =>
        fields.includes(field) && String(body[field] ?? "").trim() === ""
    )) {
        return res.status(400).json({ error: "Required content fields cannot be empty." });
    }
    if (
        req.params.collection === "site" &&
        body.content !== undefined &&
        (typeof body.content !== "object" || body.content === null || Array.isArray(body.content))
    ) {
        return res.status(400).json({ error: "Section content must be a JSON object." });
    }
    if (req.params.collection === "calendar" && (fields.includes("start_time") || fields.includes("end_time"))) {
        const start = new Date(body.start_time);
        const end = new Date(body.end_time);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({ error: "Update both event times and ensure the end is after the start." });
        }
    }

    try {
        const values = fields.map((field) => body[field]);
        const updates = fields.map((field, index) => `${field} = $${index + 1}`);
        if (resource.touch) {
            updates.push(`${resource.touch} = NOW()`);
        }
        values.push(id);
        const result = await pool.query(
            `UPDATE ${resource.table}
             SET ${updates.join(", ")}
             WHERE ${resource.key} = $${values.length}
             RETURNING *`,
            values
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Content record not found." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(`Error updating admin content ${req.params.collection}:`, error);
        res.status(500).json({ error: "Failed to update content." });
    }
});

app.delete("/api/admin/content/:collection/:id", requireAdmin, async (req, res) => {
    const resource = adminContentResources[req.params.collection];
    if (!resource) {
        return res.status(404).json({ error: "Unknown content collection." });
    }
    const id = req.params.id;
    if (resource.key === "id" && !/^\d+$/.test(id)) {
        return res.status(400).json({ error: "Content identifier is invalid." });
    }

    try {
        const result = await pool.query(
            `DELETE FROM ${resource.table}
             WHERE ${resource.key} = $1
             RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Content record not found." });
        }
        res.json({ message: "Content deleted successfully.", record: result.rows[0] });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({ error: "This staff record is linked to an account and cannot be deleted." });
        }
        console.error(`Error deleting admin content ${req.params.collection}:`, error);
        res.status(500).json({ error: "Failed to delete content." });
    }
});

app.listen(PORT, () => {
    console.log(`DEDAT backend running on http://localhost:${PORT}`);
});