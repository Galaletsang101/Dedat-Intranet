import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MonthGrid from "./MonthGrid";
import { MAX_VISIBLE_EVENTS_PER_CELL } from "./calendarConstants";

const manyEvents = [
  { date: "2026-11-05", title: "Event A", time: "08:00", category: "Meeting" },
  { date: "2026-11-05", title: "Event B", time: "09:00", category: "Training" },
  { date: "2026-11-05", title: "Event C", time: "10:00", category: "Leave" },
  { date: "2026-11-05", title: "Event D", time: "11:00", category: "Deadline" },
  { date: "2026-11-05", title: "Event E", time: "12:00", category: "Boardroom" },
];

function getEventsForDate(dateStr) {
  return manyEvents.filter((event) => event.date === dateStr);
}

function findDateCell(container, day) {
  const numbers = container.querySelectorAll(".date-number");

  for (const el of numbers) {
    if (el.textContent === String(day)) {
      return el.closest(".calendar-box");
    }
  }

  return null;
}

describe("MonthGrid", () => {
  it("shows at most MAX_VISIBLE_EVENTS_PER_CELL event chips plus a '+N more' indicator when a day has more events than that", () => {
    const { container } = render(
      <MonthGrid
        year={2026}
        month={10}
        isToday={() => false}
        getEventsForDate={getEventsForDate}
        onDayClick={() => {}}
      />
    );

    const cell = findDateCell(container, 5);

    expect(cell.querySelectorAll(".event-card:not(.more-indicator)").length).toBe(
      MAX_VISIBLE_EVENTS_PER_CELL
    );

    const moreIndicator = cell.querySelector(".event-card.more-indicator");
    expect(moreIndicator).not.toBeNull();
    expect(moreIndicator.textContent).toMatch(
      new RegExp(`\\+${manyEvents.length - MAX_VISIBLE_EVENTS_PER_CELL} more`, "i")
    );
  });

  it("does not show a '+more' indicator when a day has MAX_VISIBLE_EVENTS_PER_CELL or fewer events", () => {
    const { container } = render(
      <MonthGrid
        year={2026}
        month={10}
        isToday={() => false}
        getEventsForDate={(dateStr) =>
          dateStr === "2026-11-06" ? manyEvents.slice(0, 2) : []
        }
        onDayClick={() => {}}
      />
    );

    const cell = findDateCell(container, 6);

    expect(cell.querySelectorAll(".event-card").length).toBe(2);
    expect(cell.querySelector(".more-indicator")).toBeNull();
  });

  it("calls onDayClick with the clicked day number, including when the cell has an overflow indicator", () => {
    const onDayClick = vi.fn();

    const { container } = render(
      <MonthGrid
        year={2026}
        month={10}
        isToday={() => false}
        getEventsForDate={getEventsForDate}
        onDayClick={onDayClick}
      />
    );

    fireEvent.click(findDateCell(container, 5));

    expect(onDayClick).toHaveBeenCalledWith(5);
  });

  it("marks the cell isToday() reports true for with the today class", () => {
    const { container } = render(
      <MonthGrid
        year={2026}
        month={10}
        isToday={(day) => day === 24}
        getEventsForDate={() => []}
        onDayClick={() => {}}
      />
    );

    expect(findDateCell(container, 24)).toHaveClass("today");
    expect(findDateCell(container, 23)).not.toHaveClass("today");
  });

  it("renders the weekday header row", () => {
    render(
      <MonthGrid
        year={2026}
        month={10}
        isToday={() => false}
        getEventsForDate={() => []}
        onDayClick={() => {}}
      />
    );

    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
  });
});
