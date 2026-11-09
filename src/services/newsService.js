/*
 * =========================================================
 * DEDaT INTRANET - NEWS SERVICE
 * =========================================================
 *
 * React -> Express API -> PostgreSQL
 *
 * The object structure matches the PostgreSQL "news" table.
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultNews,
  readCollection,
} from "./contentStorage.js";
import { authFetch, parseJsonResponse } from "./apiClient.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
 * =========================================================
 * GET ALL NEWS
 * =========================================================
 */

export async function getNews() {
  try {
    const response = await fetch(`${API_BASE}/news`);

    if (response.ok) {
      return await response.json();
    }

    const errorText = await response.text();
    console.error(
      `News API error (${response.status}): ${errorText}`
    );
  } catch (error) {
    console.error("Failed to fetch news from API:", error);
  }

  return readCollection(STORAGE_KEYS.news, defaultNews);
}

/*
 * =========================================================
 * GET SINGLE NEWS
 * =========================================================
 */

export async function getNewsById(id) {
  const news = readCollection(STORAGE_KEYS.news, defaultNews);
  return news.find((item) => String(item.id) === String(id)) || null;
}

/*
 * =========================================================
 * CREATE NEWS
 * =========================================================
 */

export async function createNews(newsData) {
  const response = await authFetch("/news", {
    method: "POST",
    body: JSON.stringify({
      title: newsData.title || "",
      excerpt: newsData.excerpt || "",
      content_markdown: newsData.content_markdown || "",
      category: newsData.category || "News",
      author: newsData.author || "",
      publication_date: newsData.publication_date || null,
      image_url: newsData.image_url || "",
      is_featured: newsData.is_featured ?? false,
    }),
  });

  return parseJsonResponse(response, "Failed to create news.");
}

/*
 * =========================================================
 * UPDATE NEWS
 * =========================================================
 */

export async function updateNews(id, newsData) {
  const response = await authFetch(`/news/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: newsData.title || "",
      excerpt: newsData.excerpt || "",
      content_markdown: newsData.content_markdown || "",
      category: newsData.category || "News",
      author: newsData.author || "",
      publication_date: newsData.publication_date || null,
      image_url: newsData.image_url || "",
      is_featured: newsData.is_featured ?? false,
    }),
  });

  return parseJsonResponse(response, "Failed to update news.");
}

/*
 * =========================================================
 * DELETE NEWS
 * =========================================================
 */

export async function deleteNews(id) {
  const response = await authFetch(`/news/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to delete news.");
}