/*
 * =========================================================
 * DOCUMENTS SERVICE
 * =========================================================
 *
 * Frontend communicates with:
 *
 * React
 *   ↓
 * Node / Express API
 *   ↓
 * PostgreSQL
 *
 * PostgreSQL table:
 * documents
 *
 * Backend routes:
 * GET    /api/documents
 * GET    /api/documents/:id
 * POST   /api/documents
 * PUT    /api/documents/:id
 * DELETE /api/documents/:id
 *
 * =========================================================
 */

import { apiRequest } from "./api.js";


// =========================================================
// GET ALL DOCUMENTS
// =========================================================

export async function getDocuments() {
    return apiRequest("/documents");
}


// =========================================================
// GET DOCUMENT BY ID
// =========================================================

export async function getDocumentById(id) {
    return apiRequest(`/documents/${id}`);
}


// =========================================================
// CREATE DOCUMENT
// =========================================================

export async function createDocument(documentData) {
    return apiRequest("/documents", {
            method: "POST",
            body: JSON.stringify({
                title:
                    documentData.title ||
                    "",

                description:
                    documentData.description ||
                    "",

                category:
                    documentData.category ||
                    "DOCUMENT",

                keywords:
                    Array.isArray(
                        documentData.keywords
                    )
                        ? documentData.keywords.join(", ")
                        : documentData.keywords || "",

                knowledge_owner:
                    documentData.knowledge_owner ||
                    "",

                publication_date:
                    documentData.publication_date ||
                    null,

                review_date:
                    documentData.review_date ||
                    null,

                version_number:
                    documentData.version_number ||
                    "v1.0",

                status:
                    documentData.status ||
                    "Published",

                file_url:
                    documentData.file_url ||
                    "",
            }),
        });
}


// =========================================================
// UPDATE DOCUMENT
// =========================================================

export async function updateDocument(
    id,
    documentData
) {
    return apiRequest(`/admin/content/documents/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title:
                    documentData.title ||
                    "",

                description:
                    documentData.description ||
                    "",

                category:
                    documentData.category ||
                    "DOCUMENT",

                keywords:
                    Array.isArray(
                        documentData.keywords
                    )
                        ? documentData.keywords.join(", ")
                        : documentData.keywords || "",

                knowledge_owner:
                    documentData.knowledge_owner ||
                    "",

                publication_date:
                    documentData.publication_date ||
                    null,

                review_date:
                    documentData.review_date ||
                    null,

                version_number:
                    documentData.version_number ||
                    "v1.0",

                status:
                    documentData.status ||
                    "Published",

                file_url:
                    documentData.file_url ||
                    "",
            }),
        });
}


// =========================================================
// DELETE DOCUMENT
// =========================================================

export async function deleteDocument(id) {
    return apiRequest(`/admin/content/documents/${id}`, {
        method: "DELETE",
    });
}