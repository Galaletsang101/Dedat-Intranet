import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";

function renderAdminRoute(initialPath = "/admin") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<div>Login Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>Admin Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("redirects to login when nobody is signed in", () => {
    renderAdminRoute();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
  });

  it("redirects a signed-in Employee to /home instead of rendering admin content", () => {
    sessionStorage.setItem("token", "t");
    sessionStorage.setItem("user", JSON.stringify({ id: 2, role: "Employee" }));

    renderAdminRoute();

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
  });

  it("renders the admin content for a signed-in Admin", () => {
    sessionStorage.setItem("token", "t");
    sessionStorage.setItem("user", JSON.stringify({ id: 1, role: "Admin" }));

    renderAdminRoute();

    expect(screen.getByText("Admin Page")).toBeInTheDocument();
  });
});
