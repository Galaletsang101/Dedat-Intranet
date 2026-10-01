/*
 * =========================================================
 * FAQS SERVICE
 * PostgreSQL table: faqs
 * =========================================================
 */

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const response = await fetch(`${API_BASE}/faqs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  if (!response.ok) {
    let errorMessage = "Failed to create FAQ.";

    try {
      const errorData = await response.json();

      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function updateFaq(id, faqData) {
  const response = await fetch(`${API_BASE}/faqs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faqData),
  });

  if (!response.ok) {
    throw new Error("Failed to update FAQ.");
  }

  return await response.json();
}

export async function deleteFaq(id) {
  const response = await fetch(`${API_BASE}/faqs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete FAQ.");
  }

  return await response.json();
}