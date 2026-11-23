import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

const fallbackNews = [
  {
    id: 1,
    title: "Welcome to the DEDaT Intranet",
    excerpt:
      "Welcome to the new DEDaT employee intranet and its digital resources.",
    content_markdown: `# Welcome to the DEDaT Intranet

Welcome to the **DEDaT employee intranet**.

## What you can find here

- Departmental news
- Official circulars
- Policies
- Knowledge Centre resources
- Frequently asked questions
- Staff information

The intranet provides employees with a central location for accessing important departmental information.

## Getting Started

Use the navigation menu to explore the different sections of the intranet.
`,
    category: "News",
    author: "DEDaT",
    publication_date: "2026-09-13",
    image_url: "",
    is_featured: true,
    created_at: "2026-09-13T00:00:00",
    updated_at: null,
  },
];

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "postgres"}@${
    process.env.DB_HOST || "localhost"
  }:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "dedat_intranet"}`;

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error.message);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dedat-intranet-api" });
});

app.get("/api/news", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        excerpt,
        content_markdown,
        category,
        author,
        publication_date,
        image_url,
        is_featured,
        created_at,
        updated_at
      FROM news
      ORDER BY publication_date DESC NULLS LAST, created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.warn("Falling back to in-memory news data:", error.message);
    res.json(fallbackNews);
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        excerpt,
        content_markdown,
        category,
        author,
        publication_date,
        image_url,
        is_featured,
        created_at,
        updated_at
      FROM news
      WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "News article not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.warn("Falling back to in-memory news detail:", error.message);

    const found = fallbackNews.find(
      (item) => String(item.id) === String(req.params.id)
    );

    if (!found) {
      return res.status(404).json({ message: "News article not found." });
    }

    return res.json(found);
  }
});

app.post("/api/news", async (req, res) => {
  const body = req.body || {};

  const now = new Date().toISOString();

  try {
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
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        title,
        excerpt,
        content_markdown,
        category,
        author,
        publication_date,
        image_url,
        is_featured,
        created_at,
        updated_at`,
      [
        body.title,
        body.excerpt || "",
        body.content_markdown || "",
        body.category || "News",
        body.author || "",
        body.publication_date || null,
        body.image_url || "",
        body.is_featured ?? false,
        now,
        null,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.warn("Unable to write to PostgreSQL, using fallback memory write:", error.message);

    const newArticle = {
      id: Date.now(),
      title: body.title,
      excerpt: body.excerpt || "",
      content_markdown: body.content_markdown || "",
      category: body.category || "News",
      author: body.author || "",
      publication_date: body.publication_date || null,
      image_url: body.image_url || "",
      is_featured: body.is_featured ?? false,
      created_at: now,
      updated_at: null,
    };

    fallbackNews.unshift(newArticle);

    return res.status(201).json(newArticle);
  }
});

app.put("/api/news/:id", async (req, res) => {
  const body = req.body || {};

  try {
    const result = await pool.query(
      `UPDATE news
      SET
        title = COALESCE($1, title),
        excerpt = COALESCE($2, excerpt),
        content_markdown = COALESCE($3, content_markdown),
        category = COALESCE($4, category),
        author = COALESCE($5, author),
        publication_date = COALESCE($6, publication_date),
        image_url = COALESCE($7, image_url),
        is_featured = COALESCE($8, is_featured),
        updated_at = $9
      WHERE id = $10
      RETURNING
        id,
        title,
        excerpt,
        content_markdown,
        category,
        author,
        publication_date,
        image_url,
        is_featured,
        created_at,
        updated_at`,
      [
        body.title,
        body.excerpt,
        body.content_markdown,
        body.category,
        body.author,
        body.publication_date,
        body.image_url,
        body.is_featured,
        new Date().toISOString(),
        req.params.id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "News article not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.warn("Unable to update PostgreSQL, using fallback memory update:", error.message);

    const target = fallbackNews.find((item) => String(item.id) === String(req.params.id));

    if (!target) {
      return res.status(404).json({ message: "News article not found." });
    }

    Object.assign(target, body, { updated_at: new Date().toISOString() });

    return res.json(target);
  }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM news WHERE id = $1 RETURNING id`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "News article not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    console.warn("Unable to delete PostgreSQL, using fallback memory delete:", error.message);

    const before = fallbackNews.length;
    const filtered = fallbackNews.filter(
      (item) => String(item.id) !== String(req.params.id)
    );

    fallbackNews.splice(0, before, ...filtered);

    return res.json({ success: true });
  }
});

app.listen(port, () => {
  console.log(`DEDaT Intranet API listening on http://localhost:${port}`);
});
