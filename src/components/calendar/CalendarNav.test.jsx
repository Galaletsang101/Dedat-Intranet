import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarNav from "./CalendarNav";

const wednesday = new Date(2026, 10, 25); // 25 Nov 2026 is a Wednesday

describe("CalendarNav", () => {
  it("shows the month/year heading in Month view", () => {
    render(
      <CalendarNav
        currentDate={wednesday}
        view="Month"
        onViewChange={() => {}}
        onDateChange={() => {}}
      />
    );

    expect(screen.getByRole("heading", { name: /november 2026/i })).toBeInTheDocument();
  });

  it("switches to Week view and relabels the heading as a date range", () => {
    const onViewChange = vi.fn();

    render(
      <CalendarNav
        currentDate={wednesday}
        view="Month"
        onViewChange={onViewChange}
        onDateChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: "Week" }));

    expect(onViewChange).toHaveBeenCalledWith("Week");
  });

  it("renders a date-range heading (not a bare month/year) when already in Week view", () => {
    render(
      <CalendarNav
        currentDate={wednesday}
        view="Week"
        onViewChange={() => {}}
        onDateChange={() => {}}
      />
    );

    const heading = screen.getByRole("heading").textContent;
    expect(heading).not.toBe("November 2026");
    expect(heading).toMatch(/–/);
  });

  it("advances by one month in Month view", () => {
    const onDateChange = vi.fn();

    render(
      <CalendarNav
        currentDate={wednesday}
        view="Month"
        onViewChange={() => {}}
        onDateChange={onDateChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const result = onDateChange.mock.calls[0][0];
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(11); // December
  });

  it("advances by one week in Week view", () => {
    const onDateChange = vi.fn();

    render(
      <CalendarNav
        currentDate={wednesday}
        view="Week"
        onViewChange={() => {}}
        onDateChange={onDateChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const result = onDateChange.mock.calls[0][0];
    expect(result.getDate()).toBe(2); // 25 Nov + 7 = 2 Dec
    expect(result.getMonth()).toBe(11);
  });

  it("advances by one day in Day view", () => {
    const onDateChange = vi.fn();

    render(
      <CalendarNav
        currentDate={wednesday}
        view="Day"
        onViewChange={() => {}}
        onDateChange={onDateChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const result = onDateChange.mock.calls[0][0];
    expect(result.getDate()).toBe(26);
    expect(result.getMonth()).toBe(10);
  });

  it("Today resets to the current real date", () => {
    const onDateChange = vi.fn();

    render(
      <CalendarNav
        currentDate={wednesday}
        view="Month"
        onViewChange={() => {}}
        onDateChange={onDateChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Today" }));

    const result = onDateChange.mock.calls[0][0];
    const now = new Date();
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getDate()).toBe(now.getDate());
  });
});
