import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseDate, isValidDate, formatDate, formatDateTime, formatRelative } from "./dateUtils";

describe("parseDate", () => {
  it("returns null for null, undefined, and empty string", () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate("")).toBeNull();
  });

  it("returns null for an invalid date string", () => {
    expect(parseDate("not-a-date")).toBeNull();
    expect(parseDate("2026-99-99")).toBeNull();
  });

  it("parses a full ISO timestamp (PostgreSQL TIMESTAMPTZ shape)", () => {
    const result = parseDate("2026-01-15T10:30:00.000Z");
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2026);
  });

  it("parses a date-only string (PostgreSQL DATE shape) as a local calendar date, not UTC midnight", () => {
    const result = parseDate("2026-01-15");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(15);
  });

  it("does not shift a date-only value backward a day in a negative-UTC-offset timezone", () => {
    // This is exactly the bug class the date-only branch exists to avoid:
    // new Date("2026-01-15") parses as UTC midnight, which is still Jan 14
    // locally in e.g. America/New_York (UTC-5). Our parser must not do that.
    const result = parseDate("2026-01-15");
    expect(result.getDate()).toBe(15);
  });

  it("passes through an existing valid Date instance", () => {
    const d = new Date(2026, 0, 15);
    expect(parseDate(d)).toBe(d);
  });

  it("returns null for an existing invalid Date instance", () => {
    expect(parseDate(new Date("garbage"))).toBeNull();
  });
});

describe("isValidDate", () => {
  it("is true for a parseable value and false otherwise", () => {
    expect(isValidDate("2026-01-15")).toBe(true);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate("garbage")).toBe(false);
  });
});

describe("formatDate", () => {
  it("never returns the literal string 'Invalid Date'", () => {
    const inputs = [null, undefined, "", "garbage", "2026-13-40", NaN];

    for (const input of inputs) {
      expect(formatDate(input)).not.toMatch(/Invalid Date/);
    }
  });

  it("falls back to 'Date unavailable' by default for missing input", () => {
    expect(formatDate(null)).toBe("Date unavailable");
    expect(formatDate(undefined)).toBe("Date unavailable");
    expect(formatDate("")).toBe("Date unavailable");
  });

  it("honors a custom fallback string", () => {
    expect(formatDate(null, "No date set")).toBe("No date set");
  });

  it("formats a valid date-only value", () => {
    expect(formatDate("2026-01-15")).toBe("15 Jan 2026");
  });

  it("formats a valid full timestamp", () => {
    const result = formatDate("2026-01-15T10:30:00.000Z");
    expect(result).toContain("2026");
    expect(result).not.toMatch(/Invalid Date/);
  });
});

describe("formatDateTime", () => {
  it("never returns 'Invalid Date' and includes a time component for valid input", () => {
    expect(formatDateTime(null)).toBe("Date unavailable");
    expect(formatDateTime("garbage")).toBe("Date unavailable");

    const result = formatDateTime("2026-01-15T14:30:00.000Z");
    expect(result).not.toMatch(/Invalid Date/);
  });
});

describe("formatRelative", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Today' for the current date", () => {
    expect(formatRelative(new Date(2026, 0, 15))).toBe("Today");
  });

  it("returns 'Yesterday' for one day ago", () => {
    expect(formatRelative(new Date(2026, 0, 14))).toBe("Yesterday");
  });

  it("returns 'N days ago' within the last week", () => {
    expect(formatRelative(new Date(2026, 0, 12))).toBe("3 days ago");
  });

  it("falls back to a formatted date beyond a week", () => {
    expect(formatRelative(new Date(2026, 0, 1))).toBe(formatDate(new Date(2026, 0, 1)));
  });

  it("never returns 'Invalid Date' for bad input", () => {
    expect(formatRelative(null)).toBe("Date unavailable");
    expect(formatRelative("garbage")).toBe("Date unavailable");
  });
});
