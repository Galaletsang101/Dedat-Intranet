import { describe, it, expect } from "vitest";
import {
  minutesSinceMidnight,
  computeEventLayout,
  getCurrentTimePosition,
} from "./eventLayout";

const d = (h, m = 0) => new Date(2026, 0, 1, h, m, 0);
const dayStart = new Date(2026, 0, 1, 0, 0, 0);
const dayEnd = new Date(2026, 0, 2, 0, 0, 0);

describe("minutesSinceMidnight", () => {
  it("returns 0 for midnight and 810 for 13:30", () => {
    expect(minutesSinceMidnight(new Date(2026, 0, 1, 0, 0))).toBe(0);
    expect(minutesSinceMidnight(new Date(2026, 0, 1, 13, 30))).toBe(810);
  });
});

describe("computeEventLayout", () => {
  it("lays out non-overlapping events sequentially without side-by-side columns", () => {
    const events = [
      { id: 1, start: d(9), end: d(10) },
      { id: 2, start: d(11), end: d(12) },
    ];

    const laidOut = computeEventLayout(events, dayStart, dayEnd);

    expect(laidOut.find((e) => e.id === 1).column).toBe(0);
    expect(laidOut.find((e) => e.id === 1).columnCount).toBe(1);
    expect(laidOut.find((e) => e.id === 2).column).toBe(0);
    expect(laidOut.find((e) => e.id === 2).columnCount).toBe(1);
  });

  it("positions an event's top/height proportionally to its start time and duration", () => {
    const events = [{ id: 1, start: d(9, 30), end: d(10, 15) }];

    const [laidOut] = computeEventLayout(events, dayStart, dayEnd);

    expect(laidOut.top).toBe(570); // 9.5 hours * 60px/hour
    expect(laidOut.height).toBe(45); // 45 minutes * 1px/minute
  });

  it("clamps very short events to a minimum visible/clickable height", () => {
    const events = [{ id: 1, start: d(9, 0), end: d(9, 5) }];

    const [laidOut] = computeEventLayout(events, dayStart, dayEnd);

    expect(laidOut.height).toBeGreaterThanOrEqual(18);
  });

  it("assigns overlapping events to separate side-by-side columns of equal count", () => {
    const events = [
      { id: 1, start: d(9), end: d(10) },
      { id: 2, start: d(9, 30), end: d(10, 30) },
    ];

    const laidOut = computeEventLayout(events, dayStart, dayEnd);

    const columns = laidOut.map((e) => e.column).sort();
    expect(columns).toEqual([0, 1]);
    expect(laidOut[0].columnCount).toBe(2);
    expect(laidOut[1].columnCount).toBe(2);
  });

  it("reuses a freed column once its event ends, for a later event that starts after that end time", () => {
    const events = [
      { id: 1, start: d(9), end: d(10) }, // column 0
      { id: 2, start: d(9), end: d(10) }, // overlaps A -> column 1
      { id: 3, start: d(10), end: d(11) }, // starts exactly when A ends -> reuses column 0
    ];

    const laidOut = computeEventLayout(events, dayStart, dayEnd);

    const byId = Object.fromEntries(laidOut.map((e) => [e.id, e]));
    expect(byId[1].column).toBe(0);
    expect(byId[2].column).toBe(1);
    expect(byId[3].column).toBe(0);
  });

  it("clips an event that starts before the visible day range to the range start", () => {
    const events = [
      {
        id: 1,
        start: new Date(2025, 11, 31, 22, 0), // previous day 22:00
        end: new Date(2026, 0, 1, 2, 0), // today 02:00
      },
    ];

    const [laidOut] = computeEventLayout(events, dayStart, dayEnd);

    expect(laidOut.top).toBe(0);
    expect(laidOut.height).toBe(120); // 2 hours clipped to today's start
  });

  it("clips an event that ends after the visible day range to the range end", () => {
    const events = [{ id: 1, start: d(23), end: new Date(2026, 0, 2, 1, 0) }];

    const [laidOut] = computeEventLayout(events, dayStart, dayEnd);

    expect(laidOut.height).toBe(60); // 23:00 -> midnight, clipped
  });
});

describe("getCurrentTimePosition", () => {
  it("computes the current-time-line offset proportionally to minutes elapsed since midnight", () => {
    expect(getCurrentTimePosition(new Date(2026, 0, 1, 13, 30))).toBe(810);
  });
});
