import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Calendar from "./Calendar";

/*
 * Covers the day-events modal (click a date -> see what's on it, book from
 * there) and the "today" highlight on the grid. Dates are derived from the
 * real clock rather than hardcoded so the suite doesn't silently rot as time
 * passes - the Northern Cape intranet runs on SAST (UTC+2), so a noon-local
 * timestamp round-trips through toISOString() onto the same calendar date.
 */

function mockEventsResponse(events) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => events,
  });
}

function pad(value) {
  return String(value).padStart(2, "0");
}

const now = new Date();
const todayYear = now.getFullYear();
const todayMonth = now.getMonth();
const todayDay = now.getDate();
const todayDateString = `${todayYear}-${pad(todayMonth + 1)}-${pad(todayDay)}`;

// A day in the same month guaranteed not to be "today".
const emptyDay = todayDay === 5 ? 6 : 5;

function findDateCell(container, day) {
  const numbers = container.querySelectorAll(".date-number");

  for (const el of numbers) {
    if (el.textContent === String(day)) {
      return el.closest(".calendar-box");
    }
  }

  return null;
}

describe("Calendar - today highlight", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("highlights the real current date on the grid and not other dates", async () => {
    mockEventsResponse([]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, todayDay)).not.toBeNull());

    expect(findDateCell(container, todayDay)).toHaveClass("today");
    expect(findDateCell(container, emptyDay)).not.toHaveClass("today");
  });
});

describe("Calendar - day events modal", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows an empty state with a Book Boardroom action for a day with no events", async () => {
    mockEventsResponse([]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, emptyDay)).not.toBeNull());

    fireEvent.click(findDateCell(container, emptyDay));

    expect(await screen.findByText(/no events scheduled/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book boardroom/i })).toBeInTheDocument();
  });

  it("lists an event on the day it falls on, including its boardroom location, and flags today", async () => {
    mockEventsResponse([
      {
        id: 1,
        title: "Budget Review",
        description: "",
        start_time: new Date(todayYear, todayMonth, todayDay, 12, 0, 0).toISOString(),
        end_time: new Date(todayYear, todayMonth, todayDay, 13, 0, 0).toISOString(),
        category: "Boardroom",
        quarter: "Q1",
        location: "Flamingo",
      },
    ]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, todayDay)).not.toBeNull());

    fireEvent.click(findDateCell(container, todayDay));

    const dayModal = await screen.findByRole("dialog");

    expect(within(dayModal).getByText("Budget Review")).toBeInTheDocument();
    expect(within(dayModal).getByText("Flamingo")).toBeInTheDocument();
    expect(container.querySelector(".today-badge")).not.toBeNull();
  });

  it("opens the booking form from inside the day modal and closes the day modal", async () => {
    mockEventsResponse([]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, emptyDay)).not.toBeNull());

    fireEvent.click(findDateCell(container, emptyDay));
    await screen.findByText(/no events scheduled/i);

    fireEvent.click(screen.getByRole("button", { name: /book boardroom/i }));

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByText(/no events scheduled/i)).not.toBeInTheDocument();
  });

  it("closes an open modal when Escape is pressed", async () => {
    mockEventsResponse([]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, emptyDay)).not.toBeNull());

    fireEvent.click(findDateCell(container, emptyDay));
    await screen.findByText(/no events scheduled/i);

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText(/no events scheduled/i)).not.toBeInTheDocument();
    });
  });

  it("closes an open modal when clicking the overlay outside it", async () => {
    mockEventsResponse([]);

    const { container } = render(<Calendar />);

    await waitFor(() => expect(findDateCell(container, emptyDay)).not.toBeNull());

    fireEvent.click(findDateCell(container, emptyDay));
    await screen.findByText(/no events scheduled/i);

    fireEvent.click(container.querySelector(".calendar-modal-overlay"));

    await waitFor(() => {
      expect(screen.queryByText(/no events scheduled/i)).not.toBeInTheDocument();
    });
  });
});
