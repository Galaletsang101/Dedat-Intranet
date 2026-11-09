/*
 * =========================================================
 * CENTRALIZED DATE UTILITIES
 * =========================================================
 *
 * Every date shown in the UI should go through one of these functions
 * instead of a one-off `new Date(x).toLocaleDateString()` - that pattern
 * was duplicated across the app (home.jsx, NewsPage, KnowledgeCenter,
 * Profile...) and none of the copies handled a missing/invalid value, so
 * a missing field (e.g. a frontend reading `item.publish_date` when the
 * API actually returns `publication_date`) rendered the literal string
 * "Invalid Date" straight to users.
 *
 * Design notes:
 * - A plain date-only string from PostgreSQL (`DATE` columns, e.g.
 *   "2026-01-15") is parsed as LOCAL calendar components, not as UTC
 *   midnight. `new Date("2026-01-15")` parses as UTC midnight, which
 *   shifts to the previous day in any timezone west of UTC - this is the
 *   "date shown is one day off" class of bug. Parsing the Y/M/D parts
 *   directly as a local date avoids that regardless of the viewer's
 *   timezone.
 * - A full timestamp (`TIMESTAMPTZ`, ISO 8601 with a time/offset) is left
 *   to the native Date parser, which already handles the timezone
 *   conversion correctly.
 * - Every formatter returns a safe fallback string instead of ever
 *   producing "Invalid Date" - null/undefined/empty/unparsable input all
 *   resolve to the same, honest "Date unavailable" (configurable).
 * =========================================================
 */

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses any date-ish value the backend might send into a real Date, or
 * null if it genuinely can't represent a date. Never throws, never
 * returns an Invalid Date object.
 */
export function parseDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" && DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);

    // The Date constructor silently rolls over out-of-range components
    // (e.g. month 99 becomes some date years later) instead of producing
    // an Invalid Date - reject anything that didn't round-trip exactly.
    const roundTrips =
      localDate.getFullYear() === year &&
      localDate.getMonth() === month - 1 &&
      localDate.getDate() === day;

    return roundTrips ? localDate : null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isValidDate(value) {
  return parseDate(value) !== null;
}

/**
 * Date-only display, e.g. "15 Jan 2026".
 */
export function formatDate(value, fallback = "Date unavailable") {
  const date = parseDate(value);

  if (!date) {
    return fallback;
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Date + time display, e.g. "15 Jan 2026, 14:30".
 */
export function formatDateTime(value, fallback = "Date unavailable") {
  const date = parseDate(value);

  if (!date) {
    return fallback;
  }

  return date.toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Friendly relative display for recent dates ("Today", "Yesterday",
 * "3 days ago"), falling back to formatDate() beyond a week out.
 */
export function formatRelative(value, fallback = "Date unavailable") {
  const date = parseDate(value);

  if (!date) {
    return fallback;
  }

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  if (diffDays === -1) return "Tomorrow";

  return formatDate(value, fallback);
}
