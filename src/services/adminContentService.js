import { apiRequest } from "./api.js";

export const CONTENT_COLLECTIONS = {
  news: {
    label: "News",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["excerpt", "Summary", "textarea"],
      ["content_markdown", "Article", "textarea"],
      ["category", "Category", "text"],
      ["author", "Author", "text"],
      ["publication_date", "Publication date", "date"],
      ["image_url", "Image URL", "url"],
      ["is_featured", "Featured", "checkbox"],
    ],
  },
  wellness: {
    label: "Wellness videos",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["description", "Description", "textarea"],
      ["category", "Category", "text"],
      ["duration", "Duration", "text"],
      ["thumbnail", "Thumbnail URL", "url"],
      ["video_url", "Video URL", "url"],
      ["featured", "Featured", "checkbox"],
    ],
  },
  calendar: {
    label: "Calendar events",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["description", "Description", "textarea"],
      ["start_time", "Start", "datetime-local", true],
      ["end_time", "End", "datetime-local", true],
      ["category", "Category", "text"],
      ["quarter", "Quarter", "text"],
    ],
  },
  documents: {
    label: "Documents",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["description", "Description", "textarea"],
      ["category", "Category", "text"],
      ["keywords", "Keywords", "text"],
      ["knowledge_owner", "Knowledge owner", "text"],
      ["publication_date", "Publication date", "date"],
      ["review_date", "Review date", "date"],
      ["version_number", "Version", "text"],
      ["status", "Status", "text"],
      ["file_url", "File URL", "url"],
    ],
  },
  policies: {
    label: "Policies",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["policy_number", "Policy number", "text"],
      ["description", "Description", "textarea"],
      ["category", "Category", "text"],
      ["author", "Author", "text"],
      ["publication_date", "Publication date", "date"],
      ["review_date", "Review date", "date"],
      ["status", "Status", "text"],
      ["file_url", "File URL", "url"],
    ],
  },
  faqs: {
    label: "FAQs",
    key: "id",
    fields: [
      ["question", "Question", "text", true],
      ["answer", "Answer", "textarea", true],
      ["category", "Category", "text", true],
      ["keywords", "Keywords", "text"],
      ["status", "Status", "text"],
    ],
  },
  circulus: {
    label: "Circulars",
    key: "id",
    fields: [
      ["title", "Title", "text", true],
      ["description", "Description", "textarea"],
      ["category", "Category", "text"],
      ["author", "Author", "text"],
      ["publication_date", "Publication date", "date"],
      ["file_url", "File URL", "url"],
      ["status", "Status", "text"],
    ],
  },
  site: {
    label: "Website sections",
    key: "slug",
    fields: [
      ["slug", "Section key", "text", true],
      ["title", "Heading", "text", true],
      ["description", "Description", "textarea"],
      ["image_url", "Image URL", "url"],
      ["content", "Structured content (JSON)", "json"],
    ],
  },
  employees: {
    label: "Staff directory",
    key: "id",
    fields: [
      ["id", "Employee ID", "number", true],
      ["first_name", "First name", "text", true],
      ["surname", "Surname", "text", true],
      ["email", "Email", "email"],
      ["programme", "Programme", "text"],
      ["subprogramme", "Subprogramme", "text"],
      ["position", "Position", "text"],
    ],
  },
};

export const listAdminContent = (collection) =>
  apiRequest(`/admin/content/${collection}`);

export const createAdminContent = (collection, record) =>
  apiRequest(`/admin/content/${collection}`, {
    method: "POST",
    body: JSON.stringify(record),
  });

export const updateAdminContent = (collection, id, record) =>
  apiRequest(`/admin/content/${collection}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(record),
  });

export const deleteAdminContent = (collection, id) =>
  apiRequest(`/admin/content/${collection}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

export async function upsertSiteContent(slug, record) {
  const sections = await listAdminContent("site");
  const existing = sections.find((section) => section.slug === slug);
  if (existing) {
    return updateAdminContent("site", slug, record);
  }
  return createAdminContent("site", { ...record, slug });
}
