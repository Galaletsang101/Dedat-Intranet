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

const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// =========================================================
// GET ALL DOCUMENTS
// =========================================================

export async function getDocuments() {
    const response = await fetch(
        `${API_BASE}/documents`
    );

    const data = await response
        .json()
        .catch(() => []);

    if (!response.ok) {
        throw new Error(
            data?.error ||
            "Failed to fetch documents."
        );
    }

    return data;
}


// =========================================================
// GET DOCUMENT BY ID
// =========================================================

export async function getDocumentById(id) {
    const response = await fetch(
        `${API_BASE}/documents/${id}`
    );

    const data = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.error ||
            "Failed to fetch document."
        );
    }

    return data;
}


// =========================================================
// CREATE DOCUMENT
// =========================================================

export async function createDocument(documentData) {
    const response = await fetch(
        `${API_BASE}/documents`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

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
        }
    );

    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.error ||
            "Failed to create document."
        );
    }

    return data;
}


// =========================================================
// UPDATE DOCUMENT
// =========================================================

export async function updateDocument(
    id,
    documentData
) {
    const response = await fetch(
        `${API_BASE}/documents/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

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
        }
    );

    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.error ||
            "Failed to update document."
        );
    }

    return data;
}


// =========================================================
// DELETE DOCUMENT
// =========================================================

export async function deleteDocument(id) {
    const response = await fetch(
        `${API_BASE}/documents/${id}`,
        {
            method: "DELETE",
        }
    );

    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.error ||
            "Failed to delete document."
        );
    }

    return data;
}