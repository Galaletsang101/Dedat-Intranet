/*
 * =========================================================
 * DEDaT INTRANET - FRONTEND CONTENT STORAGE ADAPTER
 * =========================================================
 *
 * Provides a temporary localStorage mock layer that keeps the
 * object fields aligned with the PostgreSQL tables already
 * defined for the future Express API.
 *
 * No PostgreSQL credentials or database connection strings are
 * stored in the frontend repository.
 * =========================================================
 */

export const STORAGE_KEYS = {
  news: "dedat_intranet_news",
  circulus: "dedat_intranet_circulus",
  documents: "dedat_intranet_documents",
  policies: "dedat_intranet_policies",
  faqs: "dedat_intranet_faqs",
};

export const makeTimestamp = () => new Date().toISOString();

export const nextId = () =>
  `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export function readCollection(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Unable to read localStorage collection ${key}`, error);
    return fallback;
  }
}

export function writeCollection(key, collection) {
  localStorage.setItem(key, JSON.stringify(collection));
}

export function makeApiFallback(collectionKey, record, fallback = []) {
  const list = readCollection(collectionKey, fallback);
  const next = Array.isArray(list) ? list : [];
  next.push(record);
  writeCollection(collectionKey, next);
  return record;
}

export const defaultNews = [
  {
    id: 1,
    title: "Example News",
    excerpt: "Example summary",
    content_markdown: "# Example News\n\nThis is Markdown content.",
    category: "News",
    author: "DEDaT",
    publication_date: "2026-09-13",
    image_url: "",
    is_featured: false,
    created_at: "2026-09-13T00:00:00",
    updated_at: null,
  },
];

export const defaultCirculus = [
  {
    id: 1,
    title: "Circular 01 of 2026",
    description: "Official departmental circular.",
    category: "Circulars",
    author: "DEDaT",
    publication_date: "2026-09-13",
    file_url: "",
    status: "published",
    created_at: "2026-09-13T00:00:00",
    updated_at: null,
  },
];

export const defaultDocuments = [
  {
    id: 1,
    title: "Example Document",
    description: "Example knowledge document.",
    category: "Knowledge Centre",
    keywords: ["example", "document"],
    knowledge_owner: "DEDaT",
    publication_date: "2026-09-13",
    review_date: "2026-09-13",
    version_number: "1.0",
    status: "published",
    file_url: "",
    created_at: "2026-09-13T00:00:00",
  },
];

export const defaultPolicies = [
  {
    id: 1,
    title: "Example Policy",
    policy_number: "POL-001",
    description: "Example policy description.",
    category: "Policy",
    author: "DEDaT",
    publication_date: "2026-09-13",
    review_date: "2026-09-13",
    version_number: "1.0",
    status: "published",
    file_url: "",
    created_at: "2026-09-13T00:00:00",
  },
];

export const defaultFaqs = [
  {
    id: 1,
    question: "Where can I find the DEDaT intranet?",
    answer: "You can access the DEDaT intranet through the portal homepage.",
    category: "General",
    keywords: ["intranet", "portal"],
    status: "published",
    created_at: "2026-09-13T00:00:00",
    updated_at: "2026-09-13T00:00:00",
  },
];
