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
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

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
  try {
    const response = await fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `News API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create news:", error);
    throw error;
  }
}

/*
 * =========================================================
 * UPDATE NEWS
 * =========================================================
 */

export async function updateNews(id, newsData) {
  const news = readCollection(STORAGE_KEYS.news, defaultNews);
  const index = news.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (index === -1) {
    return null;
  }

  news[index] = {
    ...news[index],
    ...newsData,
    updated_at: makeTimestamp(),
  };

  writeCollection(STORAGE_KEYS.news, news);
  return news[index];
}

/*
 * =========================================================
 * DELETE NEWS
 * =========================================================
 */

export async function deleteNews(id) {
  const news = readCollection(STORAGE_KEYS.news, defaultNews);

  const filtered = news.filter(
    (item) => String(item.id) !== String(id)
  );

  writeCollection(STORAGE_KEYS.news, filtered);

  return filtered;
}