import { describe, it, expect, beforeEach } from "vitest";
import {
  getCurrentUser,
  getToken,
  isLoggedIn,
  isAdmin,
  logoutUser,
} from "./authService";

function setSession(user, token = "fake-token") {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
}

describe("authService session helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("reports not logged in with no token", () => {
    expect(isLoggedIn()).toBe(false);
    expect(getCurrentUser()).toBeNull();
  });

  it("reports logged in once a token is stored", () => {
    setSession({ id: 1, role: "Employee" });
    expect(isLoggedIn()).toBe(true);
    expect(getToken()).toBe("fake-token");
  });

  it("isAdmin() is false for an Employee role", () => {
    setSession({ id: 1, role: "Employee" });
    expect(isAdmin()).toBe(false);
  });

  it("isAdmin() is true only for an exact Admin role match", () => {
    setSession({ id: 1, role: "Admin" });
    expect(isAdmin()).toBe(true);
  });

  it("isAdmin() is false for a case-mismatched or forged role string", () => {
    setSession({ id: 1, role: "admin" }); // lowercase - must not match
    expect(isAdmin()).toBe(false);
  });

  it("isAdmin() is false when nobody is logged in", () => {
    expect(isAdmin()).toBe(false);
  });

  it("logoutUser() clears both token and user", () => {
    setSession({ id: 1, role: "Admin" });
    logoutUser();
    expect(isLoggedIn()).toBe(false);
    expect(getCurrentUser()).toBeNull();
    expect(isAdmin()).toBe(false);
  });

  it("getCurrentUser() tolerates corrupted session data", () => {
    sessionStorage.setItem("user", "{not-json");
    expect(getCurrentUser()).toBeNull();
  });
});
