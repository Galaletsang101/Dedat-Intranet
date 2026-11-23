import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminModal from "./AdminModal";

describe("AdminModal", () => {
  it("renders an accessible dialog with the given title", () => {
    render(
      <AdminModal titleId="t1" title="Add Employee" onClose={() => {}}>
        <p>Form content</p>
      </AdminModal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "t1");
    expect(screen.getByText("Add Employee")).toBeInTheDocument();
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <AdminModal titleId="t1" title="Add Employee" onClose={onClose}>
        <p>content</p>
      </AdminModal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay is clicked, but not the dialog body", () => {
    const onClose = vi.fn();
    const { container } = render(
      <AdminModal titleId="t1" title="Add Employee" onClose={onClose}>
        <p>content</p>
      </AdminModal>
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector(".admin-modal-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
