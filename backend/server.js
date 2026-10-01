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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "DEDAT Intranet Backend is running"
    });
});

app.get("/api/news", async (req, res) => {
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

app.post("/api/news", async (req, res) => {
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

app.get("/api/wellness", async (req, res) => {
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

app.get("/api/wellness", async (req, res) => {
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
// CREATE WELLNESS VIDEO
// ============================================================

app.post("/api/wellness", async (req, res) => {
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

        // Check what the frontend is sending
        console.log("WELLNESS POST DATA:", req.body);

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
app.get("/api/calendar-events", async (req, res) => {
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

app.post(
    "/api/calendar-events",
    authenticateToken,
    async (req, res) => {
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
            if (!title || !start_time || !end_time) {
                return res.status(400).json({
                    error: "Title, start time and end time are required"
                });
            }

            // Make sure the end time is after the start time
            if (new Date(end_time) <= new Date(start_time)) {
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

            res.status(201).json({
                message: "Calendar event created successfully.",
                event: result.rows[0]
            });

        } catch (error) {
            console.error("Error saving calendar event:", error);

            res.status(500).json({
                error: "Failed to save calendar event."
            });
        }
    }
);

// ============================================================
// DOCUMENTS
// ============================================================

// GET all documents
app.get("/api/documents", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM documents
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
app.get("/api/documents/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM documents
             WHERE id = $1`,
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
app.post("/api/documents", async (req, res) => {
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
app.put("/api/documents/:id", async (req, res) => {
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
app.delete("/api/documents/:id", async (req, res) => {
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
app.get("/api/policies", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM policies ORDER BY created_at DESC"
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
app.post("/api/policies", async (req, res) => {
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

        if (!title) {
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
app.get("/api/faqs", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM faqs ORDER BY created_at DESC"
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
app.post("/api/faqs", async (req, res) => {
    try {
        const {
            question,
            answer,
            category,
            keywords,
            status
        } = req.body;

        // Validate required fields
        if (!question || !answer || !category) {
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
app.get("/api/circulus", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM circulus ORDER BY publication_date DESC"
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

app.post("/api/circulus", async (req, res) => {
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
        res.status(500).json({
            error: "Failed to fetch users"
        });
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


app.listen(PORT, () => {
    console.log(`DEDAT backend running on http://localhost:${PORT}`);
});