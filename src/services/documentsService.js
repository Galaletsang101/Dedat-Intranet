/*
 * =========================================================
 * DOCUMENTS SERVICE
 * PostgreSQL table: documents
 * Object shape mirrors the existing documents table.
 * Temporary mock: localStorage.
 * Future API route: GET/POST/PUT/DELETE /documents
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultDocuments,
  readCollection,
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getDocuments() {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/documents`);

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for documents, using localStorage mock.", error);
  }

  return readCollection(STORAGE_KEYS.documents, defaultDocuments);
}

export async function getDocumentById(id) {
  const docs = readCollection(STORAGE_KEYS.documents, defaultDocuments);
  return docs.find((doc) => String(doc.id) === String(id)) || null;
}

export async function createDocument(documentData) {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: documentData.title || "",
          description: documentData.description || "",
          category: documentData.category || "Knowledge Centre",
          keywords: Array.isArray(documentData.keywords)
            ? documentData.keywords
            : [],
          knowledge_owner: documentData.knowledge_owner || "",
          publication_date: documentData.publication_date || null,
          review_date: documentData.review_date || null,
          version_number: documentData.version_number || "1.0",
          status: documentData.status || "draft",
          file_url: documentData.file_url || "",
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for documents, using localStorage mock.", error);
  }

  const docs = readCollection(STORAGE_KEYS.documents, defaultDocuments);
  const record = {
    id: nextId(),
    title: documentData.title || "",
    description: documentData.description || "",
    category: documentData.category || "Knowledge Centre",
    keywords: Array.isArray(documentData.keywords)
      ? documentData.keywords
      : [],
    knowledge_owner: documentData.knowledge_owner || "",
    publication_date: documentData.publication_date || null,
    review_date: documentData.review_date || null,
    version_number: documentData.version_number || "1.0",
    status: documentData.status || "draft",
    file_url: documentData.file_url || "",
    created_at: makeTimestamp(),
  };

  docs.push(record);
  writeCollection(STORAGE_KEYS.documents, docs);

  return record;
}

export async function updateDocument(id, documentData) {
  const docs = readCollection(STORAGE_KEYS.documents, defaultDocuments);
  const index = docs.findIndex((doc) => String(doc.id) === String(id));

  if (index === -1) {
    return null;
  }

  docs[index] = {
    ...docs[index],
    ...documentData,
    updated_at: makeTimestamp(),
  };

  writeCollection(STORAGE_KEYS.documents, docs);
  return docs[index];
}

export async function deleteDocument(id) {
  const docs = readCollection(STORAGE_KEYS.documents, defaultDocuments);
  const filtered = docs.filter((doc) => String(doc.id) !== String(id));
  writeCollection(STORAGE_KEYS.documents, filtered);
  return filtered;
}
