/*
 * =========================================================
 * SHARED API CLIENT
 * =========================================================
 *
 * Every write to the backend (POST/PUT/DELETE) now requires a valid JWT -
 * the backend enforces Admin-only on content-management endpoints. This
 * helper attaches the signed-in user's token automatically so every
 * service file only has to call authFetch() instead of re-deriving the
 * Authorization header by hand.
 * =========================================================
 */

import { getToken } from "./authService";

export const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function authFetch(path, options = {}) {
    const token = getToken();

    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${API_BASE}${path}`, { ...options, headers });
}

export async function parseJsonResponse(response, fallbackError) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || fallbackError);
    }

    return data;
}
