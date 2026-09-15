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

app.listen(PORT, () => {
    console.log(`DEDAT backend running on http://localhost:${PORT}`);
});