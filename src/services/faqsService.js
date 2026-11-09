import { apiRequest } from "./api.js";

export const getFaqs = () => apiRequest("/faqs");

export async function getFaqById(id) {
  const records = await apiRequest("/admin/content/faqs");
  return records.find((item) => String(item.id) === String(id)) || null;
}

export const createFaq = (faqData) =>
  apiRequest("/faqs", {
    method: "POST",
    body: JSON.stringify(faqData),
  });

export const updateFaq = (id, faqData) =>
  apiRequest(`/admin/content/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify(faqData),
  });

export const deleteFaq = (id) =>
  apiRequest(`/admin/content/faqs/${id}`, { method: "DELETE" });
