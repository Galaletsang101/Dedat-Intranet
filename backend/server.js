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
// POST boardroom booking
app.post("/api/calendar-events", async (req, res) => {
    try {
        const {
            title,
            description,
            start_time,
            end_time,
            quarter
        } = req.body;

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

        // Check for an overlapping boardroom booking
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

        // Create the booking
        const result = await pool.query(
            `INSERT INTO calendar_events
            (title, description, start_time, end_time, category, quarter)
            VALUES ($1, $2, $3, $4, 'Boardroom', $5)
            RETURNING *`,
            [
                title,
                description || null,
                start_time,
                end_time,
                quarter || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
  console.error("Error saving boardroom booking:", error);

  if (error.message.includes("409")) {
    alert("The boardroom is already booked for this time.");
  } else {
    alert("Failed to save boardroom booking.");
  }
}
});

// GET documents
app.get("/api/documents", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM documents ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({
            error: "Failed to fetch documents"
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

// GET circulus
app.get("/api/circulus", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM circulus ORDER BY date_published DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching circulus:", error);
        res.status(500).json({
            error: "Failed to fetch circulus"
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