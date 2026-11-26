import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DayEventsModal from "./DayEventsModal";

const realEvent = {
  id: 42,
  title: "Budget Review",
  category: "Boardroom",
  time: "09:00",
  endTime: "10:00",
  location: "Flamingo",
};

const holidayEvent = {
  // Holidays come from a static import with no `id` - never cancellable.
  title: "Heritage Day",
  category: "Holiday",
  time: "",
};

function renderModal(overrides = {}) {
  const onCancelEvent = vi.fn();

  const utils = render(
    <DayEventsModal
      selectedDate="2026-11-25"
      isToday={false}
      events={[realEvent]}
      onClose={() => {}}
      onBookBoardroom={() => {}}
      isAdmin={false}
      onCancelEvent={onCancelEvent}
      {...overrides}
    />
  );

  return { ...utils, onCancelEvent };
}

describe("DayEventsModal - admin cancellation", () => {
  it("does not show a Cancel button when the viewer is not an Admin", () => {
    renderModal({ isAdmin: false });

    expect(screen.queryByRole("button", { name: /cancel event/i })).toBeNull();
  });

  it("shows a Cancel button for a real event when the viewer is an Admin", () => {
    renderModal({ isAdmin: true });

    expect(screen.getByRole("button", { name: /cancel event/i })).toBeInTheDocument();
  });

  it("does not show a Cancel button for an entry with no id (e.g. a holiday)", () => {
    renderModal({ isAdmin: true, events: [holidayEvent] });

    expect(screen.queryByRole("button", { name: /cancel event/i })).toBeNull();
  });

  it("requires a second confirming click before calling onCancelEvent", () => {
    const { onCancelEvent } = renderModal({ isAdmin: true });

    fireEvent.click(screen.getByRole("button", { name: /cancel event/i }));

    expect(onCancelEvent).not.toHaveBeenCalled();
    expect(screen.getByText(/cancel this event/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /yes, cancel/i }));

    expect(onCancelEvent).toHaveBeenCalledWith(42);
  });

  it("dismisses the inline confirmation without cancelling when the user backs out", () => {
    const { onCancelEvent } = renderModal({ isAdmin: true });

    fireEvent.click(screen.getByRole("button", { name: /cancel event/i }));
    fireEvent.click(screen.getByRole("button", { name: /^no$/i }));

    expect(onCancelEvent).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /cancel event/i })).toBeInTheDocument();
  });
});
