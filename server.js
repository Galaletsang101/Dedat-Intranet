import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pg from "pg";
import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";

dotenv.config({ path: path.resolve("backend/.env") });

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || "dedat_intranet",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      }
);

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !process.env.JWT_SECRET) {
    return res.status(token ? 500 : 401).json({
      error: token ? "Authentication is not configured." : "Authentication is required.",
    });
  }

  try {
    const [headerPart, payloadPart, signaturePart] = token.split(".");
    if (!headerPart || !payloadPart || !signaturePart) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }
    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    const expected = createHmac("sha256", process.env.JWT_SECRET)
      .update(`${headerPart}.${payloadPart}`)
      .digest();
    const provided = Buffer.from(signaturePart, "base64url");
    if (
      header.alg !== "HS256" ||
      expected.length !== provided.length ||
      !timingSafeEqual(expected, provided) ||
      (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) ||
      (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000))
    ) {
      return res.status(401).json({ error: "Invalid or expired authentication token." });
    }
    if (String(payload.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Administrator access is required." });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid authentication token." });
  }
}

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
    console.error("Unable to fetch news from PostgreSQL:", error.message);
    res.status(500).json({ error: "Failed to fetch news." });
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
    console.error("Unable to fetch news detail from PostgreSQL:", error.message);
    return res.status(500).json({ error: "Failed to fetch news article." });
  }
});

app.post("/api/news", requireAdmin, async (req, res) => {
  const body = req.body || {};

  if (!String(body.title || "").trim()) {
    return res.status(400).json({ error: "News title is required." });
  }

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
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Unable to create news in PostgreSQL:", error.message);
    return res.status(500).json({ error: "Failed to create news article." });
  }
});

app.put("/api/news/:id", requireAdmin, async (req, res) => {
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
    console.error("Unable to update news in PostgreSQL:", error.message);
    return res.status(500).json({ error: "Failed to update news article." });
  }
});

app.delete("/api/news/:id", requireAdmin, async (req, res) => {
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
    console.error("Unable to delete news from PostgreSQL:", error.message);
    return res.status(500).json({ error: "Failed to delete news article." });
  }
});

app.listen(port, () => {
  console.log(`DEDaT Intranet API listening on http://localhost:${port}`);
});
