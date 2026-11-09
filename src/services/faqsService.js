/*
 * =========================================================
 * FAQS SERVICE
 * PostgreSQL table: faqs
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";

export async function getFaqs() {
  const response = await fetch(`${API_BASE}/faqs`);

  if (!response.ok) {
    throw new Error("Failed to fetch FAQs.");
  }

  return await response.json();
}

export async function getFaqById(id) {
  const response = await fetch(`${API_BASE}/faqs/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch FAQ.");
  }

  return await response.json();
}

export async function createFaq(faqData) {
  const response = await authFetch("/faqs", {
    method: "POST",
    body: JSON.stringify({
      question: faqData.question || "",
      answer: faqData.answer || "",
      category: faqData.category || "General",
      keywords: Array.isArray(faqData.keywords)
        ? faqData.keywords.join(", ")
        : faqData.keywords || "",
      status: faqData.status || "draft",
    }),
  });

  return parseJsonResponse(response, "Failed to create FAQ.");
}

export async function updateFaq(id, faqData) {
  const response = await authFetch(`/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      question: faqData.question || "",
      answer: faqData.answer || "",
      category: faqData.category || "General",
      keywords: Array.isArray(faqData.keywords)
        ? faqData.keywords.join(", ")
        : faqData.keywords || "",
      status: faqData.status || "draft",
    }),
  });

  return parseJsonResponse(response, "Failed to update FAQ.");
}

export async function deleteFaq(id) {
  const response = await authFetch(`/faqs/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to delete FAQ.");
}
