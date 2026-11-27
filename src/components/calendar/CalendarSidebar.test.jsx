import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import CalendarSidebar from "./CalendarSidebar";

const filters = {
  Meeting: true,
  Training: false,
  Leave: true,
  Deadline: true,
  Boardroom: true,
  Holiday: true,
};

const events = [
  {
    id: 1,
    category: "Boardroom",
    date: "2026-11-20", // past
    time: "09:00",
    endTime: "10:00",
    title: "Past Booking",
    location: "Augrabies",
  },
  {
    id: 2,
    category: "Boardroom",
    date: "2026-11-26", // today
    time: "09:00",
    endTime: "10:00",
    title: "Today Booking",
    location: "Flamingo",
  },
  {
    id: 3,
    category: "Boardroom",
    date: "2026-11-27", // tomorrow
    time: "09:00",
    endTime: "10:00",
    title: "Tomorrow Booking",
    location: "Kokerboom",
  },
];

function renderSidebar(overrides = {}) {
  const onFilterChange = vi.fn();

  const utils = render(
    <CalendarSidebar
      filters={filters}
      onFilterChange={onFilterChange}
      events={events}
      todayDateString="2026-11-26"
      {...overrides}
    />
  );

  return { ...utils, onFilterChange };
}

describe("CalendarSidebar", () => {
  it("renders a checkbox for each filter category reflecting its checked state", () => {
    renderSidebar();

    expect(screen.getByRole("checkbox", { name: "Meeting" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Training" })).not.toBeChecked();
  });

  it("calls onFilterChange with the category and new checked value", () => {
    const { onFilterChange } = renderSidebar();

    fireEvent.click(screen.getByRole("checkbox", { name: "Training" }));

    expect(onFilterChange).toHaveBeenCalledWith("Training", true);
  });

  it("shows an empty state when there are no upcoming boardroom bookings", () => {
    renderSidebar({ events: [] });

    expect(screen.getByText(/no upcoming boardroom bookings/i)).toBeInTheDocument();
  });

  it("excludes past boardroom bookings from the list", () => {
    renderSidebar();

    expect(screen.queryByText("Past Booking")).toBeNull();
  });

  it("groups boardroom bookings under one date heading per day", () => {
    const { container } = renderSidebar();

    const dayGroups = container.querySelectorAll(".boardroom-day-group");
    expect(dayGroups).toHaveLength(2);

    expect(within(dayGroups[0]).getByText("Today Booking")).toBeInTheDocument();
    expect(within(dayGroups[1]).getByText("Tomorrow Booking")).toBeInTheDocument();
  });
});
