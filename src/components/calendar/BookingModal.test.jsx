import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BookingModal from "./BookingModal";

const validForm = {
  date: "2026-12-01",
  title: "Budget Planning",
  description: "",
  location: "Augrabies",
  time: "09:00",
  endTime: "10:00",
  attendees: "",
  requirements: "",
};

function renderModal(overrides = {}) {
  const onFieldChange = vi.fn();
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  const utils = render(
    <BookingModal
      value={validForm}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={false}
      error={null}
      {...overrides}
    />
  );

  return { ...utils, onFieldChange, onSubmit, onCancel };
}

describe("BookingModal", () => {
  beforeEach(() => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({ first_name: "Jane", surname: "Doe" })
    );
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("pre-fills and renders the organiser field as read-only from the logged-in user", () => {
    renderModal();

    expect(screen.getByText(/booked by:\s*jane doe/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/organiser/i)).toBeNull();
  });

  it("shows an inline validation message instead of alert() when attendees is not a positive whole number", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { onSubmit } = renderModal({
      value: { ...validForm, attendees: "2.5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText(/whole number between 1 and 100/i)
    ).toBeInTheDocument();
  });

  it("calls onSubmit when every field is valid", () => {
    const { onSubmit } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows an inline message and does not submit when a required field is missing", () => {
    const { onSubmit } = renderModal({ value: { ...validForm, title: "" } });

    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it("disables the Confirm Booking button and shows a loading state while the request is in flight", () => {
    renderModal({ isSubmitting: true });

    const button = screen.getByRole("button", { name: /booking\.\.\./i });
    expect(button).toBeDisabled();
  });

  it("shows a server-supplied error as an inline banner", () => {
    renderModal({ error: "Augrabies is already booked for this time." });

    expect(
      screen.getByText("Augrabies is already booked for this time.")
    ).toBeInTheDocument();
  });
});
