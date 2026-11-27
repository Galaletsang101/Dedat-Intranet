import { describe, it, expect } from "vitest";
import { getUpcomingBoardroomBookings, groupBookingsByDay } from "./boardroomSchedule";

const TODAY = "2026-11-26";

const events = [
  { id: 1, category: "Boardroom", date: "2026-11-20", time: "09:00", title: "Past Booking" },
  { id: 2, category: "Meeting", date: "2026-11-27", time: "09:00", title: "Not A Boardroom" },
  { id: 3, category: "Boardroom", date: "2026-11-27", time: "14:00", title: "Later Tomorrow" },
  { id: 4, category: "Boardroom", date: "2026-11-26", time: "15:00", title: "Today Later" },
  { id: 5, category: "Boardroom", date: "2026-11-26", time: "09:00", title: "Today Earlier" },
  { id: 6, category: "Boardroom", date: "2026-11-27", time: "09:00", title: "Earlier Tomorrow" },
];

describe("getUpcomingBoardroomBookings", () => {
  it("excludes bookings before today and non-Boardroom events", () => {
    const result = getUpcomingBoardroomBookings(events, TODAY);
    const ids = result.map((e) => e.id);

    expect(ids).not.toContain(1); // past
    expect(ids).not.toContain(2); // not Boardroom
  });

  it("sorts the remaining bookings by date, then by time within a date", () => {
    const result = getUpcomingBoardroomBookings(events, TODAY);

    expect(result.map((e) => e.id)).toEqual([5, 4, 6, 3]);
  });

  it("includes a booking dated exactly today", () => {
    const result = getUpcomingBoardroomBookings(events, TODAY);

    expect(result.some((e) => e.id === 5)).toBe(true);
  });
});

describe("groupBookingsByDay", () => {
  it("groups consecutive same-date bookings into one entry", () => {
    const sorted = getUpcomingBoardroomBookings(events, TODAY);
    const groups = groupBookingsByDay(sorted);

    expect(groups).toHaveLength(2);
    expect(groups[0].date).toBe("2026-11-26");
    expect(groups[0].bookings.map((b) => b.id)).toEqual([5, 4]);
    expect(groups[1].date).toBe("2026-11-27");
    expect(groups[1].bookings.map((b) => b.id)).toEqual([6, 3]);
  });

  it("returns an empty array for an empty input", () => {
    expect(groupBookingsByDay([])).toEqual([]);
  });
});
