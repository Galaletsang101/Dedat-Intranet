import { apiRequest } from "./api.js";

export const getNews = () => apiRequest("/news");

export async function getNewsById(id) {
  const records = await getNews();
  return records.find((item) => String(item.id) === String(id)) || null;
}

export const createNews = (newsData) =>
  apiRequest("/news", {
    method: "POST",
    body: JSON.stringify(newsData),
  });

export const updateNews = (id, newsData) =>
  apiRequest(`/admin/content/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(newsData),
  });

export const deleteNews = (id) =>
  apiRequest(`/admin/content/news/${id}`, { method: "DELETE" });
