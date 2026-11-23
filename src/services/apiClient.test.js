import { describe, it, expect, beforeEach, vi } from "vitest";
import { authFetch, parseJsonResponse } from "./apiClient";

describe("authFetch", () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  it("does not attach an Authorization header when logged out", async () => {
    await authFetch("/news");

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("attaches a Bearer token when logged in", async () => {
    sessionStorage.setItem("token", "abc123");

    await authFetch("/news", { method: "POST", body: "{}" });

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
  });

  it("sets Content-Type only when a body is present", async () => {
    sessionStorage.setItem("token", "abc123");

    await authFetch("/employees/1", { method: "DELETE" });

    const [, deleteOptions] = global.fetch.mock.calls[0];
    expect(deleteOptions.headers["Content-Type"]).toBeUndefined();
  });
});

describe("parseJsonResponse", () => {
  it("returns parsed JSON on success", async () => {
    const response = { ok: true, json: async () => ({ id: 1 }) };
    await expect(parseJsonResponse(response, "fail")).resolves.toEqual({ id: 1 });
  });

  it("throws the server error message on failure", async () => {
    const response = { ok: false, json: async () => ({ error: "Forbidden" }) };
    await expect(parseJsonResponse(response, "fallback")).rejects.toThrow("Forbidden");
  });

  it("falls back to a generic message when the body has no error field", async () => {
    const response = { ok: false, json: async () => ({}) };
    await expect(parseJsonResponse(response, "fallback message")).rejects.toThrow(
      "fallback message"
    );
  });
});
