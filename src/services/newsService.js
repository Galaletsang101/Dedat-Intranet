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

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";
import { getToken } from "./authService.js";

/*
 * =========================================================
 * GET ALL NEWS (Published only - the public listing)
 * =========================================================
 */

export async function getNews() {
  const response = await fetch(`${API_BASE}/news`);
  return parseJsonResponse(response, "Failed to fetch news.");
}

/*
 * =========================================================
 * GET SINGLE NEWS ARTICLE (backs the full-article reading page)
 *
 * Sends the current token if there is one, so an Admin previewing a
 * Draft article they're still writing can open it; published articles
 * are visible to anyone.
 * =========================================================
 */

export async function getNewsById(id) {
  const token = getToken();

  const response = await fetch(`${API_BASE}/news/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return parseJsonResponse(response, "Failed to fetch news article.");
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
      status: newsData.status || "Published",
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
      status: newsData.status || "Published",
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

/*
 * =========================================================
 * ADMIN: ALL NEWS, INCLUDING DRAFTS
 * =========================================================
 */

export async function getAdminNews() {
  const response = await authFetch("/admin/news");
  return parseJsonResponse(response, "Failed to fetch news.");
}
