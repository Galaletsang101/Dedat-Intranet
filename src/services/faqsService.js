/*
 * =========================================================
 * FAQS SERVICE
 * PostgreSQL table: faqs
 * Object shape mirrors the existing faqs table.
 * Temporary mock: localStorage.
 * Future API route: GET/POST/PUT/DELETE /faqs
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultFaqs,
  readCollection,
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getFaqs() {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/faqs`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for FAQs, using localStorage mock.", error);
  }

  return readCollection(STORAGE_KEYS.faqs, defaultFaqs);
}

export async function getFaqById(id) {
  const faqs = readCollection(STORAGE_KEYS.faqs, defaultFaqs);
  return faqs.find((item) => String(item.id) === String(id)) || null;
}

export async function createFaq(faqData) {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: faqData.question || "",
          answer: faqData.answer || "",
          category: faqData.category || "General",
          keywords: Array.isArray(faqData.keywords)
            ? faqData.keywords
            : [],
          status: faqData.status || "draft",
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for FAQs, using localStorage mock.", error);
  }

  const faqs = readCollection(STORAGE_KEYS.faqs, defaultFaqs);
  const record = {
    id: nextId(),
    question: faqData.question || "",
    answer: faqData.answer || "",
    category: faqData.category || "General",
    keywords: Array.isArray(faqData.keywords)
      ? faqData.keywords
      : [],
    status: faqData.status || "draft",
    created_at: makeTimestamp(),
    updated_at: makeTimestamp(),
  };

  faqs.push(record);
  writeCollection(STORAGE_KEYS.faqs, faqs);

  return record;
}

export async function updateFaq(id, faqData) {
  const faqs = readCollection(STORAGE_KEYS.faqs, defaultFaqs);
  const index = faqs.findIndex((faq) => String(faq.id) === String(id));

  if (index === -1) {
    return null;
  }

  faqs[index] = {
    ...faqs[index],
    ...faqData,
    updated_at: makeTimestamp(),
  };

  writeCollection(STORAGE_KEYS.faqs, faqs);
  return faqs[index];
}

export async function deleteFaq(id) {
  const faqs = readCollection(STORAGE_KEYS.faqs, defaultFaqs);
  const filtered = faqs.filter((faq) => String(faq.id) !== String(id));
  writeCollection(STORAGE_KEYS.faqs, filtered);
  return filtered;
}
