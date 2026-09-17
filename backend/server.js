const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

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

app.listen(PORT, () => {
    console.log(`DEDAT backend running on http://localhost:${PORT}`);
});